const authService = require('../services/authService');

const isNonEmptyString = (value, { min = 1, max = 255 } = {}) => {
    return typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
};

const sanitizeString = (value) => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
       if (trimmed.includes('$')) return '';
    return trimmed;
};

const isValidEmail = (email) => {
    if (typeof email !== 'string') return false;
    const normalized = email.trim().toLowerCase();
    // Simple RFC5322-inspired regex (practical, not perfect)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(normalized);
};

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');

const isValidRole = (role) => ['candidate', 'employer', 'admin'].includes(role);

const sendValidationError = (res, message, details = undefined) => {
    return res.status(400).json({ message, ...(details ? { details } : {}) });
};

// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    const firstName = sanitizeString(req.body.firstName);
    const lastName = sanitizeString(req.body.lastName);
    const email = normalizeEmail(req.body.email);
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const role = sanitizeString(req.body.role || 'candidate');

   
    if (!isNonEmptyString(firstName, { min: 2, max: 100 })) return sendValidationError(res, 'Invalid firstName');
    if (!isNonEmptyString(lastName, { min: 1, max: 100 })) return sendValidationError(res, 'Invalid lastName');
    if (!isValidEmail(email)) return sendValidationError(res, 'Invalid email');
    if (typeof password !== 'string' || password.length < 6) return sendValidationError(res, 'Password must be at least 6 characters');
    if (!isValidRole(role)) return sendValidationError(res, 'Invalid role');
    try {
        
        const existing = await authService.getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await authService.createUser({ firstName, lastName, email, password, role });
        const token = authService.generateToken(user._id);
        
        res.status(201).json({
            ...authService.formatUserResponse(user),
            token
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        if (error.message === 'User already exists') {
            return res.status(400).json({ message: error.message });
        }
        
        console.error('[Register Error]', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!isValidEmail(email) || !isNonEmptyString(password, { min: 1, max: 1024 })) {
        return sendValidationError(res, 'Invalid credentials');
    }
    try {
        const existing = await authService.getUserByEmail(email);
        if (!existing) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = await authService.authenticateUser(email, password);
        const token = authService.generateToken(user._id);
        
        res.json({
            ...authService.formatUserResponse(user),
            token
        });
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.error('[Login Error]', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.googlePopupAuth = async (req, res) => {
  try {
    const credential = typeof req.body.credential === 'string' ? req.body.credential : '';
    const roleRaw = sanitizeString(req.body.role || 'candidate');
    const role = isValidRole(roleRaw) ? roleRaw : 'candidate';
    if (!credential) return res.status(400).json({ message: 'No credential provided' });

    const payload = await authService.verifyGoogleToken(credential);
    const user = await authService.findOrCreateGoogleUser(payload, role);
    const token = authService.generateToken(user._id, user.email, user.role);

    res.json({ 
      token, 
      email: user.email, 
      role: user.role,
      ...authService.formatUserResponse(user)
    });
  } catch (err) {
    console.error('[Google Popup Auth Error]', err);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.id);
        res.json(user);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ message: 'User not found' });
        }
        console.error('[Get Profile Error]', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
    try {
        // Allow only whitelisted fields
        const updates = {};
        if (req.body.firstName !== undefined) updates.firstName = sanitizeString(req.body.firstName);
        if (req.body.lastName !== undefined) updates.lastName = sanitizeString(req.body.lastName);
        if (req.body.email !== undefined) {
            const newEmail = normalizeEmail(req.body.email);
            if (!isValidEmail(newEmail)) return sendValidationError(res, 'Invalid email');
            updates.email = newEmail;
        }
        if (req.body.profilePic !== undefined && isNonEmptyString(req.body.profilePic, { min: 1, max: 2048 })) {
            updates.profilePic = sanitizeString(req.body.profilePic);
        }

        const user = await authService.updateUserProfile(req.user.id, updates);
        res.json({ message: 'Profile updated', user });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ message: 'User not found' });
        }
        // Handle duplicate email on update
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        console.error('[Update Profile Error]', error);
        res.status(500).json({ message: 'Server Error' });
    }
};