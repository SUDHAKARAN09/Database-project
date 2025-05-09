const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  accountnumber: { type: String, required: true },
  password: { type: String, required: true },
  emailid: { type: String, required: true, unique: true },
  mobilenumber: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
