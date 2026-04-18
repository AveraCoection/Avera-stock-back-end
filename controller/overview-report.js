const Sold = require("../models/SoldCataloge");
const CatalogeDesign = require("../models/catalogDesign");
const Cataloge = require("../models/cataloge");
const Buyer = require("../models/buyers");
const mongoose = require("mongoose");

// ─── helpers ────────────────────────────────────────────────────────────────

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const dateRange = (from, to) => {
  const start = from ? new Date(from) : new Date("2000-01-01");
  const end = to ? new Date(to) : new Date();
  end.setHours(23, 59, 59, 999);
  return { $gte: start, $lte: end };
};

// ─── GET /api/report/summary/:userId ────────────────────────────────────────
// Returns top-level KPIs + daily sales for the requested window.
// Query params: from, to  (ISO date strings, optional)
const getSummaryReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { from, to } = req.query;
    const uid = toObjectId(userId);
    const createdAt = dateRange(from, to);

    // ── 1. Sales KPIs ──────────────────────────────────────────────────────
    const [salesKPI] = await Sold.aggregate([
      { $match: { userID: uid, createdAt } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$grandTotal" },
          totalDelivery: { $sum: { $ifNull: ["$deliveryCharges", 0] } },
          totalInvoices: { $sum: 1 },
          totalKhazanaSold: { $sum: { $sum: "$catalogues.khazana" } },
        },
      },
    ]);

    // ── 2. Daily sales breakdown ───────────────────────────────────────────
    const dailySales = await Sold.aggregate([
      { $match: { userID: uid, createdAt } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$grandTotal" },
          invoices: { $sum: 1 },
          khazanaSold: { $sum: { $sum: "$catalogues.khazana" } },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", revenue: 1, invoices: 1, khazanaSold: 1 } },
    ]);

    // ── 3. Stock KPIs ──────────────────────────────────────────────────────
    const [stockKPI] = await CatalogeDesign.aggregate([
      { $match: { userID: uid } },
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$stock" },
          totalKhazanaInStock: { $sum: "$khazana_stock" },
          totalSellStock: { $sum: { $ifNull: ["$sell_stock", 0] } },
          totalDesigns: { $sum: 1 },
        },
      },
    ]);

    // ── 4. Buyer receivables ───────────────────────────────────────────────
    const [buyerKPI] = await Buyer.aggregate([
      { $match: { userID: uid } },
      {
        $group: {
          _id: null,
          totalBillIssued: { $sum: "$totalBill" },
          totalReceived: { $sum: "$paid_amount" },
          totalPending: { $sum: "$remaining_amount" },
          totalBuyers: { $sum: 1 },
        },
      },
    ]);

    // ── 5. Per-catalogue stock snapshot ───────────────────────────────────
    const catalogueStock = await Cataloge.aggregate([
      { $match: { userID: uid } },
      {
        $lookup: {
          from: "catalogedesigns",
          localField: "_id",
          foreignField: "cataloge",
          as: "designs",
        },
      },
      {
        $project: {
          _id: 0,
          catalogue: "$cataloge_number",
          totalStock: { $sum: "$designs.stock" },
          totalKhazana: { $sum: "$designs.khazana_stock" },
          totalSold: { $sum: "$designs.sell_stock" },
          designCount: { $size: "$designs" },
        },
      },
      { $sort: { catalogue: 1 } },
    ]);

    // ── 6. Top buyers by revenue ───────────────────────────────────────────
    const topBuyers = await Sold.aggregate([
      { $match: { userID: uid, createdAt } },
      {
        $group: {
          _id: "$buyer",
          totalSpent: { $sum: "$grandTotal" },
          invoiceCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          buyer: "$_id",
          totalSpent: 1,
          invoiceCount: 1,
        },
      },
    ]);

    res.status(200).json({
      period: { from: from || null, to: to || null },
      sales: {
        totalRevenue: salesKPI?.totalRevenue ?? 0,
        totalDelivery: salesKPI?.totalDelivery ?? 0,
        totalInvoices: salesKPI?.totalInvoices ?? 0,
        totalKhazanaSold: salesKPI?.totalKhazanaSold ?? 0,
        dailyBreakdown: dailySales,
      },
      stock: {
        totalStock: stockKPI?.totalStock ?? 0,
        totalKhazanaInStock: stockKPI?.totalKhazanaInStock ?? 0,
        totalSellStock: stockKPI?.totalSellStock ?? 0,
        totalDesigns: stockKPI?.totalDesigns ?? 0,
        byCatalogue: catalogueStock,
      },
      buyers: {
        totalBillIssued: buyerKPI?.totalBillIssued ?? 0,
        totalReceived: buyerKPI?.totalReceived ?? 0,
        totalPending: buyerKPI?.totalPending ?? 0,
        totalBuyers: buyerKPI?.totalBuyers ?? 0,
        topBuyers,
      },
    });
  } catch (err) {
    console.error("[ReportController] getSummaryReport:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── GET /api/report/stock/:userId ──────────────────────────────────────────
// Detailed per-design stock table
const getStockReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const uid = toObjectId(userId);

    const designs = await CatalogeDesign.find({ userID: uid })
      .populate("cataloge", "cataloge_number")
      .lean();

    const rows = designs.map((d) => ({
      catalogue: d.cataloge?.cataloge_number ?? "—",
      designNumber: d.design_number,
      stock: d.stock,
      khazanaStock: d.khazana_stock,
      sellStock: d.sell_stock ?? 0,
      costPrice: d.cost_price,
      price: d.price ?? 0,
    }));

    res.status(200).json({ designs: rows });
  } catch (err) {
    console.error("[ReportController] getStockReport:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── GET /api/report/sales/:userId ──────────────────────────────────────────
// Paginated sales invoice list
const getSalesReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { from, to, page = 1, limit = 20 } = req.query;
    const uid = toObjectId(userId);
    const createdAt = dateRange(from, to);

    const skip = (Number(page) - 1) * Number(limit);

    const [sales, total] = await Promise.all([
      Sold.find({ userID: uid, createdAt })
        .populate("catalogues.catalogeId", "cataloge_number")
        .populate("catalogues.designId", "design_number")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Sold.countDocuments({ userID: uid, createdAt }),
    ]);

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      sales,
    });
  } catch (err) {
    console.error("[ReportController] getSalesReport:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getSummaryReport, getStockReport, getSalesReport };