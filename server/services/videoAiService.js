// This service now uses the new AI Service Manager with strategy pattern

const aiServiceManager = require('./aiServiceManager');

const generateInitialQuestion = async (jobDetails, resumeText) => {
  return await aiServiceManager.generateInitialQuestion(jobDetails, resumeText);
};

const generateFollowUpQuestion = async (transcriptHistory, jobDetails) => {
  return await aiServiceManager.generateFollowUpQuestion(transcriptHistory, jobDetails);
};

const analyzeInterviewTranscript = async (transcript, jobDetails) => {
  return await aiServiceManager.analyzeInterviewTranscript(transcript, jobDetails);
};

module.exports = {
  generateInitialQuestion,
  generateFollowUpQuestion,
  analyzeInterviewTranscript,
};