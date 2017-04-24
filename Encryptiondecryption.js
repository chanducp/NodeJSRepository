
var crypto = require('crypto-js');
 
var secretMessage = {
    name: 'Chandu',
    secretName: '2730'
};
var secretKey = '123cpcsp';
 
// Encrypt
var encryptedMessage = crypto.AES.Encrypt(JSON.stringify(secretMessage), secretKey);
console.log('Encrypted Message: ' + encryptedMessage);
 
// Decrypt Message
var bytes = crypto.AES.decrypt(encryptedMessage, secretKey);
var decryptedMessage = JSON.parse(bytes.toString(crypto.enc.Utf8));
 
console.log(decryptedMessage);
console.log(decryptedMessage.secretName);