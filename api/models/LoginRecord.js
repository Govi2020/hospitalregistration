const mongoose = require('mongoose');

const loginRecordSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  accessCode: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  sessionID: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const LoginRecord = mongoose.model('LoginRecord', loginRecordSchema);

module.exports = LoginRecord;
