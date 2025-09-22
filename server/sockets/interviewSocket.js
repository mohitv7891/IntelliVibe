const path = require('path');
const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const { startStreamingRecognize } = require('../services/googleSpeechService');
const Application = require('../models/Application');
const aiServiceManager = require('../services/aiServiceManager');

// Simple in-memory store; consider Redis for production
const interviewSessions = new Map();

module.exports = function attachInterviewSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    let fullTranscript = '';
    let recognizeStream = null;

    const getInterviewState = () => interviewSessions.get(socket.id);
    const setInterviewState = (newState) => interviewSessions.set(socket.id, { ...getInterviewState(), ...newState });

    socket.on('join-room', (applicationId) => {
      console.log(`[Socket] User ${socket.id} joined room for application: ${applicationId}`);
      interviewSessions.set(socket.id, {
        applicationId,
        questionCount: 0,
        fullTranscript: '',
      });
      socket.emit('session-ready');
    });

    socket.on('start-audio-stream', () => {
      if (recognizeStream) {
        recognizeStream.end();
        recognizeStream = null;
      }
      fullTranscript = '';
      recognizeStream = startStreamingRecognize(
        ({ transcript, isFinal }) => {
          socket.emit('live-transcript', transcript);
          if (isFinal && transcript) {
            fullTranscript += transcript + ' ';
          }
        },
        (err) => {
          console.error('[Google Streaming Error]', err);
          socket.emit('transcription-error', err.message || 'Streaming error');
        }
      );
    });

    socket.on('audio-chunk', (chunk) => {
      if (recognizeStream) {
        recognizeStream.write(chunk);
      }
    });

    socket.on('end-audio-stream', () => {
      if (recognizeStream) {
        recognizeStream.end();
        recognizeStream = null;
      }
      setInterviewState({ fullTranscript: fullTranscript.trim() });
      socket.emit('final-transcript', fullTranscript.trim());
    });

    const handleNextQuestion = async () => {
      const state = getInterviewState();
      if (!state) {
        console.error(`[Error] handleNextQuestion called but no session found for ${socket.id}`);
        socket.emit('error', { message: 'Your session has expired. Please refresh the page.' });
        return;
      }

      if (state.questionCount >= 5) {
        console.log(`[Interview] Ending interview for ${socket.id}`);
        const analysis = await aiServiceManager.analyzeInterviewTranscript(state.fullTranscript, state.jobDetails);
        try {
          const application = await Application.findById(state.applicationId);
          if (application) {
            application.videoAnalysisReport = {
              overallScore: analysis.score,
              summary: analysis.summary,
            };
            application.status = analysis.status;
            application.screeningStage = analysis.status === 'AI Interview Passed' ? 'video_completed' : 'video_failed';
            await application.save();
            console.log(`[DB] Application ${state.applicationId} updated with interview analysis.`);
          }
        } catch (error) {
          console.error(`[DB] Error updating application ${state.applicationId}:`, error);
        }
        socket.emit('interview-finished', { analysis });
        interviewSessions.delete(socket.id);
        return;
      }

      const nextQuestion = await aiServiceManager.generateFollowUpQuestion(state.fullTranscript, state.jobDetails);
      setInterviewState({
        ...state,
        questionCount: state.questionCount + 1,
        fullTranscript: '',
      });
      socket.emit('new-question', { question: nextQuestion, questionNumber: getInterviewState().questionCount });
    };

    socket.on('start-interview', async () => {
      console.log(`[Interview] Starting interview for ${socket.id}`);
      const state = getInterviewState();
      if (!state) return;
      try {
        const application = await Application.findById(state.applicationId).populate('job');
        if (application) {
          const jobDetails = application.job;
          const resumePath = path.join(__dirname, application.resumeUrl && application.resumeUrl.startsWith('uploads') ? '..' : '..', application.resumeUrl || '');
          const dataBuffer = await fs.readFile(resumePath);
          const data = await pdfParse(dataBuffer);
          const resumeText = data.text;
          const firstQuestion = await aiServiceManager.generateInitialQuestion(jobDetails, resumeText);
          setInterviewState({
            ...state,
            questionCount: 1,
            jobDetails: {
              title: jobDetails.title,
              skills: jobDetails.skills,
            },
          });
          socket.emit('new-question', { question: firstQuestion, questionNumber: 1 });
        } else {
          socket.emit('error', { message: 'Application not found.' });
        }
      } catch (error) {
        console.error('[Error] CRITICAL: Could not start interview.', error);
        socket.emit('error', { message: 'Failed to start interview. Check server logs for details.' });
      }
    });

    socket.on('end-answer', (data) => {
      const state = getInterviewState();
      if (data && data.transcript) {
        setInterviewState({ ...state, fullTranscript: data.transcript.trim() });
      }
      setTimeout(() => {
        handleNextQuestion();
      }, 1000);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
      interviewSessions.delete(socket.id);
    });
  });
}


