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
        // phoneNumber: 'Number',
    imageUrl: 'String',
    role : 'String',

});
UserSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};

UserSchema.methods.isValidPassword = async function (password) {
  const user = await this.constructor.findById(this._id).select('+password');
  return bcrypt.compare(password, user.password);
};

UserSchema.methods.generateJWT = async function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET);
};

const User = mongoose.model("users", UserSchema);
module.exports = User;