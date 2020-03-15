const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileScheme = new Schema({
  nameEncrypted: String,
  nameForAuthor: {
    type: String,
    required: false,
    default: null,
  },
  sourceExtension: String,
  creator: String,
  creatorId: String,
  numberOfDownloads: {
    type: Number,
    required: false,
    default: 0,
  },
  dateCreation: String,
}, {versionKey: false});

module.exports = mongoose.model('File', fileScheme);
