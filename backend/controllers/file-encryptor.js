const crypto = require('crypto');
const fs = require('fs');

const Encryptor = {};

Encryptor.encryptFile = function (inputPath, outputPath, key, options, callback) {

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = Encryptor.combineOptions(options);

  const keyBuf = new Buffer(key);

  const inputStream = fs.createReadStream(inputPath);
  const outputStream = fs.createWriteStream(outputPath);
  const cipher = crypto.createCipher(options.algorithm, keyBuf);

  inputStream.on('data', function (data) {
    const buf = new Buffer(cipher.update(data), 'binary');
    outputStream.write(buf);
  });

  inputStream.on('end', function () {
    try {
      const buf = new Buffer(cipher.final('binary'), 'binary');
      outputStream.write(buf);
      outputStream.end();
      outputStream.on('close', function () {
        return callback();
      });
    } catch (e) {
      fs.unlink(outputPath);
      return callback(e);
    }
  });
};

Encryptor.decryptFile = function (inputPath, outputPath, key, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = Encryptor.combineOptions(options);

  const keyBuf = new Buffer(key);

  const inputStream = fs.createReadStream(inputPath);
  const outputStream = fs.createWriteStream(outputPath);
  const cipher = crypto.createDecipher(options.algorithm, keyBuf);

  inputStream.on('data', function (data) {
    const buf = new Buffer(cipher.update(data), 'binary');
    outputStream.write(buf);
  });

  inputStream.on('end', function () {
    try {
      const buf = new Buffer(cipher.final('binary'), 'binary');
      outputStream.write(buf);
      outputStream.end();
      outputStream.on('close', function () {
        return callback();
      });
    } catch (e) {
      outputStream.end();

      fs.unlink(outputPath, (err) => {
        if (err) console.log(err);
      });

      return callback(e);
    }
  });
};

Encryptor.combineOptions = function (options) {
  const result = {};
  for (const key in Encryptor.defaultOptions) {
    result[key] = Encryptor.defaultOptions[key];
  }

  for (const key in options) {
    result[key] = options[key];
  }

  return result;
};

Encryptor.defaultOptions = {
  algorithm: 'aes192'
};

module.exports = Encryptor;

