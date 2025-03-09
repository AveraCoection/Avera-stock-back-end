const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const UserSchema = new mongoose.Schema({
    firstName: 'String',
    lastName : 'String',
    email:  {
        type: String,
        required: true,
        unique : true,
      },
      password: {
        type: String,
        required: true,
        select: false,
    },
    imageUrl: 'String',
    resetPasswordToken : "String",
    role: { type: String, enum: ['Admin', 'staff'], default: 'Admin' },
    staffCredentials: [{
      email: { type: String, unique: true, sparse: true },
      password: { type: String, select: false}
    }]
});
UserSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};

UserSchema.methods.isValidPassword = async function (password, isStaffEmail = null) {
  const user = await this.constructor.findById(this._id).select('+password +staffCredentials.password');

  if (isStaffEmail) {
      const staffAccount = user.staffCredentials.find(staff => staff.email === isStaffEmail);
      if (!staffAccount || !staffAccount.password) return false;
      return bcrypt.compare(password, staffAccount.password);
  }

  return bcrypt.compare(password, user.password);
};


// UserSchema.methods.generateJWT = async function () {
//   return jwt.sign({ email: this.email }, process.env.JWT_SECRET);
// };

UserSchema.methods.generateJWT = async function () {
  return jwt.sign(
    { email: this.email, role: this.role, userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const User = mongoose.model("users", UserSchema);
module.exports = User;