const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('Running keys.js...');

const privateKeyPath = path.join(__dirname, 'private_key.pem');
const publicKeyPath = path.join(__dirname, 'public_key.pem');

if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
  console.log('Generating new RSA keys...');
  
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  fs.writeFileSync(privateKeyPath, privateKey);
  fs.writeFileSync(publicKeyPath, publicKey);

  console.log('RSA keys generated and saved to /config folder');
} else {
  console.log('RSA keys already exist. Skipping generation.');
}

const RSA_PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');
const RSA_PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

const AES_SECRET_KEY = crypto.randomBytes(32).toString('hex');

console.log('AES key generated.');

module.exports = {
  RSA_PRIVATE_KEY,
  RSA_PUBLIC_KEY,
  AES_SECRET_KEY,
};