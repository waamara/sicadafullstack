const express = require('express');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { authenticateToken, authorizeRole, authorizePortal } = require('../middleware/auth');
const { validateUser, validateUserUpdate, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Get all users (admin can see all, others see their portal users)
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { page, limit, role, portal, status } = req.query;
    const user = req.user;
    
    // Admin can see all users, others are restricted to their portal
    let options = { page: parseInt(page), limit: parseInt(limit), role, portal, status };
    
    if (user.role !== 'admin') {
      // Non-admin users can only see users from their portal
      options.portal = user.portal;
    }
    
    const users = await User.findAll(options);
    const stats = await User.getStats();

    res.json({
      success: true,
      data: users.map(user => user.toPublicJSON()),
      stats
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get users by portal (portal-specific access)
router.get('/portal/:portal', authenticateToken, authorizePortal(['business', 'police', 'wilaya']), validatePagination, async (req, res) => {
  try {
    const { portal } = req.params;
    const { page, limit, role, status } = req.query;
    
    // Check if user has access to this portal
    if (req.user.portal !== portal && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied for this portal'
      });
    }

    const options = { page: parseInt(page), limit: parseInt(limit), role, portal, status };
    const users = await User.findAll(options);

    res.json({
      success: true,
      data: users.map(user => user.toPublicJSON())
    });
  } catch (error) {
    console.error('Get portal users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, validateId, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has access to view this user
    if (req.user.role !== 'admin' && req.user.portal !== user.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new user (admin can create any, others can create in their portal)
router.post('/', authenticateToken, validateUser, async (req, res) => {
  try {
    const userData = req.body;
    const currentUser = req.user;

    // Non-admin users can only create users in their portal
    if (currentUser.role !== 'admin') {
      userData.portal = currentUser.portal;
      // Business portal users create admin users (all business users are admins)
      userData.role = currentUser.portal === 'business' ? 'admin' : 'employee';
    }

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

    const newUser = await User.create(userData);

    // Log activity
    await Activity.logUserActivity(
      newUser.id,
      'user_created',
      `New user created: ${newUser.fullName}`,
      currentUser.full_name,
      currentUser.portal
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser.toPublicJSON()
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user (admin can update any, others can update users in their portal)
router.put('/:id', authenticateToken, validateId, validateUserUpdate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has access to update this user
    if (req.user.role !== 'admin' && req.user.portal !== user.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { password, ...updateData } = req.body;

    // Non-admin users cannot change role or portal
    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.portal;
    }

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
      'user_updated',
      `User updated: ${user.fullName}`,
      req.user.full_name,
      req.user.portal
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user status (admin can update any, others can update users in their portal)
router.patch('/:id/status', authenticateToken, validateId, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (active or inactive)'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has access to update this user's status
    if (req.user.role !== 'admin' && req.user.portal !== user.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await user.update({ status });

    // Log activity
    await Activity.logUserActivity(
      user.id,
      'user_status_updated',
      `User status updated to ${status}: ${user.fullName}`,
      req.user.full_name,
      req.user.portal
    );

    res.json({
      success: true,
      message: `User status updated to ${status}`,
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, validateId, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has access to delete this user
    // Admins can delete any user, others can only delete users in their portal
    if (req.user.role !== 'admin' && req.user.portal !== user.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Prevent users from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.delete();

    // Log activity
    await Activity.logUserActivity(
      null,
      'user_deleted',
      `User deleted: ${user.fullName}`,
      req.user.full_name,
      req.user.portal
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user statistics
router.get('/stats/overview', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const stats = await User.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
