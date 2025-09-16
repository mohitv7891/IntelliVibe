// server/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    companyName: { type: String, required: true }, 
    location: { type: String, required: true },
    skills: { type: [String], required: true }, 
    salary: { type: String }, 
    jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
    description: { type: String, required: true },
    expiryDate: { type: Date }, 
    isActive: { type: Boolean, default: true }, 
    interviewDuration: { type: Number }, 
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);