const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const register = async (req, res, next) => {
    try {
        const { username, password, role, assignedProvince, assignedDistrict, assignedStation } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                error: true,
                message: 'Username already exists'
            });
        }

        const user = await User.create({
            username,
            password,
            role,
            assignedProvince,
            assignedDistrict,
            assignedStation
        });

        const token = generateToken(user);

        res.status(201).json({
            error: false,
            message: 'User registered successfully',
            data: {
                user: user,
                token: token
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: true,
                message: 'Username and password are required'
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                error: true,
                message: 'Invalid credentials'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                error: true,
                message: 'Account is deactivated'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                error: true,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            error: false,
            message: 'Login successful',
            data: {
                user: user,
                token: token
            }
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('assignedProvince', 'name code')
            .populate('assignedDistrict', 'name code')
            .populate('assignedStation', 'name');

        if (!user) {
            return res.status(404).json({
                error: true,
                message: 'User not found'
            });
        }

        res.status(200).json({
            error: false,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getProfile };
