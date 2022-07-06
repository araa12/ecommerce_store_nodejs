const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {

    email: { type: String, required: true, unique: true },
    fullName: {type: String, required: true},
    image: {type: String, default: 'new-user'},
    password: { type: String, required: true },
    address: {type: String, default: ''},
    token: { type: String },
    isAdmin: { type: Boolean, default: false },
  }, 
  { timestamps: true }
);

module.exports = mongoose.model('User',userSchema);
// module.exports = mongoose.models.User || mongoose.model('User', userSchema);