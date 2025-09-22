const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId, email = null, role = null) => {
  const payload = { id: userId };
  if (email) payload.email = email;
  if (role) payload.role = role;
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const createUser = async ({ firstName, lastName, email, password, role, googleId, provider }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }
  const user = await User.create({ firstName, lastName, email, password, role, googleId, provider });
  return user;
};

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid email or password');
  }
  return user;
};

const verifyGoogleToken = async (credential) => {
  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid Google token');
  }
  return payload;
};

const findOrCreateGoogleUser = async (payload, role = 'candidate') => {
  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      firstName: payload.given_name || 'Google',
      lastName: payload.family_name || 'User',
      email: payload.email,
      googleId: payload.sub,
      provider: 'google',
      password: '',
      role: role || 'candidate',
    });
  }
  return user;
};

const getUserByEmail = async (email) => {
  if (!email) return null;
  return await User.findOne({ email });
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password -googleId');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const { firstName, lastName, email, profilePic } = updateData;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (profilePic) user.profilePic = profilePic;
  await user.save();
  return user;
};

const formatUserResponse = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  profilePic: user.profilePic,
});

module.exports = {
  generateToken,
  createUser,
  authenticateUser,
  verifyGoogleToken,
  findOrCreateGoogleUser,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  formatUserResponse,
};
