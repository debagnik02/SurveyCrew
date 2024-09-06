const mongoose = require('mongoose');


// Survey Schema
const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdByEmail: { type: String, required: true }, // Store the user's email as the identifier
  questions: [{ 
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['multiple-choice', 'text', 'checkbox'], required: true },
    options: { type: [String], default: [] }, // Array of strings for options (only used for 'mcq' and 'checkbox')
    isRequired: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Response Schema

const responseSchema = new mongoose.Schema({
  survey: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [{
    question: { type: String, required: true }, // Use String instead of ObjectId
    answer: { 
      type: mongoose.Schema.Types.Mixed, // Can be a string or an array of indexes
      required: true
    }
  }],
  submittedAt: { type: Date, default: Date.now }
});


// Models
const Survey = mongoose.model('Survey', surveySchema);
const Response = mongoose.model('Response', responseSchema);
module.exports = { Survey, Response};