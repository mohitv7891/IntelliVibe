// client/src/services/socketService.js
import { io } from 'socket.io-client';


const SOCKET_URL = '/';

let socket = null;
let isConnected = false;
let pendingEmits = [];

const processPendingEmits = () => {
    while (pendingEmits.length > 0) {
        const { event, data } = pendingEmits.shift();
        console.log(`[Socket] Processing pending emit: ${event}`);
        socket.emit(event, data);
    }
};

const connect = () => {
    if (!socket || !socket.connected) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('[Socket] Connected to server');
            isConnected = true;
            processPendingEmits();
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
            isConnected = false;
        });

        socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error.message);
            isConnected = false;
        });

        socket.on('reconnect', (attemptNumber) => {
            console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
            isConnected = true;
            processPendingEmits();
        });

        socket.on('reconnect_failed', () => {
            console.error('[Socket] Failed to reconnect');
            isConnected = false;
        });
    }

    socket.connect();
    return socket;
};

const disconnect = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        isConnected = false;
        pendingEmits = [];
    }
};

const emit = (event, data) => {
    if (socket && isConnected) {
        socket.emit(event, data);
    } else {
        console.log(`[Socket] Queuing emit for ${event} - not connected yet`);
        pendingEmits.push({ event, data });
    }
};

const on = (event, callback) => {
    if (socket) {
        socket.on(event, callback);
    }
};

const off = (event, callback) => {
    if (socket) {
        socket.off(event, callback);
    }
};

// Interview-specific helpers
const joinInterviewRoom = (applicationId, callback) => {
    emit('join-interview-room', applicationId, callback);
};

const startInterview = (applicationId) => {
    emit('start-interview', applicationId);
};

const sendAudioStream = (audioData) => {
    emit('audio-stream', audioData);
};

const sendCandidateAnswer = (data) => {
    emit('candidate-answer-finished', data);
};

const reportProctoringViolation = (violation) => {
    emit('proctoring-violation', violation);
};

const socketService = {
    connect,
    disconnect,
    emit,
    on,
    off,
    joinInterviewRoom,
    startInterview,
    sendAudioStream,
    sendCandidateAnswer,
    reportProctoringViolation,
};

export default socketService;
