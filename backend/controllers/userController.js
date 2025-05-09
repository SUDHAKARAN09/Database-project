const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { RSA_PRIVATE_KEY, RSA_PUBLIC_KEY, AES_SECRET_KEY } = require('../config/keys');
const User = require('../models/userModel');

function encryptAES(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_SECRET_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decryptAES(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_SECRET_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function encryptRSA(text) {
  return crypto.publicEncrypt(RSA_PUBLIC_KEY, Buffer.from(text)).toString('base64');
}

function decryptRSA(text) {
  return crypto.privateDecrypt(RSA_PRIVATE_KEY, Buffer.from(text, 'base64')).toString('utf8');
}

exports.registerUser = async (req, res) => {
  const { user_id, username, accountnumber, password, emailid, mobilenumber } = req.body;

  if (!user_id || !username || !accountnumber || !password || !emailid || !mobilenumber) {
    return res.status(400).json({ error: 'All fields are required and cannot be empty' });
  }

  try {
    const encryptedEmailId = encryptRSA(encryptAES(emailid));
    const existingUser = await User.findOne({ 
      $or: [
        { emailid: encryptedEmailId },
        { user_id: user_id }
      ]
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User ID or Email is already in use' });
    }

    const encryptedAccountNumber = encryptRSA(encryptAES(accountnumber));
    const encryptedPassword = await bcrypt.hash(password, 10);
    const encryptedMobileNumber = encryptRSA(encryptAES(mobilenumber));

    const newUser = new User({
      user_id,
      username,
      accountnumber: encryptedAccountNumber,
      password: encryptedPassword,
      emailid: encryptedEmailId,
      mobilenumber: encryptedMobileNumber,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Failed to register user: ' + error.message });
  }
};

exports.getUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const decryptedAccountNumber = decryptAES(decryptRSA(user.accountnumber));
    const decryptedEmailId = decryptAES(decryptRSA(user.emailid));
    const decryptedMobileNumber = decryptAES(decryptRSA(user.mobilenumber));

    res.status(200).json({
      user_id: user.user_id,
      username: user.username,
      accountnumber: decryptedAccountNumber,
      emailid: decryptedEmailId,
      mobilenumber: decryptedMobileNumber,
    });
  } catch (error) {
    console.error('Error during user retrieval:', error);
    res.status(500).json({ error: 'Failed to retrieve user data: ' + error.message });
  }
};
