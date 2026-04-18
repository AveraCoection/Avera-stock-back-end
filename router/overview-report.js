const express = require("express");
const app = express();
const { getSummaryReport, getStockReport, getSalesReport } = require("../controller/overview-report");

// GET /api/report/summary/:userId?from=2024-01-01&to=2024-12-31
app.get("/summary/:userId", getSummaryReport);

// GET /api/report/stock/:userId
app.get("/stock/:userId", getStockReport);

// GET /api/report/sales/:userId?from=&to=&page=1&limit=20
app.get("/sales/:userId", getSalesReport);

module.exports = app;