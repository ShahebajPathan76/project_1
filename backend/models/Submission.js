const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true }, // reference by ObjectId
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: {
  type: String,
  enum: ['Accepted', 'Wrong Answer', 'Compile Error', 'Runtime Error', 'TLE', 'Internal Error'],
  required: true
},

  createdAt: { type: Date, default: Date.now }
});

// Export model
module.exports = mongoose.model('Submission', submissionSchema);
