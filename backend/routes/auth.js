const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateLogin, validateUser } = require('../middleware/validation');

const router = express.Router();

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email and role
    const user = await User.findByEmail(email);
    if (!user || user.role !== role) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role, 
        portal: user.portal 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Log activity
    await Activity.logUserActivity(
      user.id,
      'user_login',
      `User logged in to ${user.portal} portal`,
      user.fullName,
      user.portal
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register new user (admin only)
router.post('/register', authenticateToken, authorizeRole(['admin']), validateUser, async (req, res) => {
  try {
    const userData = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if ID card already exists
    const existingIdCard = await User.findByIdCard(userData.idCard);
    if (existingIdCard) {
      return res.status(400).json({
        success: false,
        message: 'User with this ID card already exists'
      });
    }

    // Create new user
    const newUser = await User.create(userData);

    // Log activity
    await Activity.logUserActivity(
      newUser.id,
      'user_registered',
      `New user registered: ${newUser.fullName}`,
      req.user.full_name,
      req.user.portal
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser.toPublicJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, validateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from update data
    const { password, ...updateData } = req.body;

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findByEmail(updateData.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Check if ID card is being changed and if it already exists
    if (updateData.idCard && updateData.idCard !== user.idCard) {
      const existingIdCard = await User.findByIdCard(updateData.idCard);
      if (existingIdCard) {
        return res.status(400).json({
          success: false,
          message: 'ID card already in use'
        });
      }
    }

    await user.update(updateData);

    // Log activity
    await Activity.logUserActivity(
      user.id,
      'profile_updated',
      'User profile updated',
      user.fullName,
      user.portal
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await user.verifyPassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await user.updatePassword(newPassword);

    // Log activity
    await Activity.logUserActivity(
      user.id,
      'password_changed',
      'User changed password',
      user.fullName,
      user.portal
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout (client-side token removal, but we can log the activity)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log activity
    await Activity.logUserActivity(
      req.user.id,
      'user_logout',
      `User logged out from ${req.user.portal} portal`,
      req.user.full_name,
      req.user.portal
    );

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify token
router.get('/verify', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: req.user
    }
  });
});

module.exports = router;

