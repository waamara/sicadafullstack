const express = require('express');
const Ticket = require('../models/Ticket');
const Activity = require('../models/Activity');
const { authenticateToken, authorizeRole, authorizePortal } = require('../middleware/auth');
const { validateTicket, validateTicketUpdate, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public endpoint for external platforms to submit user requests
router.post('/user-request', async (req, res) => {
  try {
    const { fullName, email, phone, idCard, department, position } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !idCard || !department || !position) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: fullName, email, phone, idCard, department, position'
      });
    }

    // Check if user already exists
    const User = require('../models/User');
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if ID card already exists
    const existingIdCard = await User.findByIdCard(idCard);
    if (existingIdCard) {
      return res.status(400).json({
        success: false,
        message: 'User with this ID card already exists'
      });
    }

    // Create user request ticket
    const ticketData = {
      title: `User Access Request - ${fullName}`,
      description: `New user requesting access to the business portal. Details: Name: ${fullName}, Email: ${email}, Phone: ${phone}, ID Card: ${idCard}, Department: ${department}, Position: ${position}`,
      type: 'user_request',
      priority: 'medium',
      status: 'pending',
      portal: 'business',
      userId: 'external', // External request
      userRequestData: {
        fullName,
        email,
        phone,
        idCard,
        department,
        position
      }
    };

    const ticket = await Ticket.create(ticketData);

    res.status(201).json({
      success: true,
      message: 'User request submitted successfully',
      data: {
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        createdAt: ticket.createdAt
      }
    });
  } catch (error) {
    console.error('Create user request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all tickets
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { page, limit, status, type, priority, userId } = req.query;
    const options = { 
      page: parseInt(page), 
      limit: parseInt(limit), 
      status, 
      type, 
      priority,
      userId: userId || (req.user.role === 'admin' ? undefined : (req.user.role === 'police_officer' ? undefined : req.user.id)),
      portal: req.user.role !== 'admin' ? req.user.portal : undefined
    };
    
    const tickets = await Ticket.findAll(options);
    const stats = await Ticket.getStats(req.user.role !== 'admin' ? req.user.portal : null);

    res.json({
      success: true,
      data: tickets.map(ticket => ticket.toJSON()),
      stats
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get tickets by portal
router.get('/portal/:portal', authenticateToken, authorizePortal(['business', 'police', 'wilaya']), validatePagination, async (req, res) => {
  try {
    const { portal } = req.params;
    const { page, limit, status, type, priority } = req.query;
    
    // Check if user has access to this portal
    if (req.user.portal !== portal && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied for this portal'
      });
    }

    const options = { 
      page: parseInt(page), 
      limit: parseInt(limit), 
      status, 
      type, 
      priority,
      portal,
      userId: req.user.role === 'admin' ? undefined : (req.user.role === 'police_officer' ? undefined : req.user.id)
    };
    
    const tickets = await Ticket.findAll(options);
    const stats = await Ticket.getStats(portal);

    res.json({
      success: true,
      data: tickets.map(ticket => ticket.toJSON()),
      stats
    });
  } catch (error) {
    console.error('Get portal tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get ticket by ID
router.get('/:id', authenticateToken, validateId, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user has access to view this ticket
    if (req.user.role !== 'admin' && req.user.portal !== ticket.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: ticket.toJSON()
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new ticket
router.post('/', authenticateToken, validateTicket, async (req, res) => {
  try {
    const ticketData = {
      ...req.body,
      userId: req.user.id,
      portal: req.user.portal
    };

    const ticket = await Ticket.create(ticketData);

    // Log activity
    await Activity.logTicketActivity(
      ticket.id,
      'ticket_created',
      `New ${ticket.type} ticket created: ${ticket.title}`,
      req.user.full_name,
      req.user.portal,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket.toJSON()
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update ticket
router.put('/:id', authenticateToken, validateId, validateTicketUpdate, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user has access to update this ticket
    if (req.user.role !== 'admin' && req.user.portal !== ticket.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Regular users can only update their own tickets
    if (req.user.role !== 'admin' && ticket.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own tickets'
      });
    }

    await ticket.update(req.body);

    // Log activity
    await Activity.logTicketActivity(
      ticket.id,
      'ticket_updated',
      `Ticket updated: ${ticket.title}`,
      req.user.full_name,
      req.user.portal,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket.toJSON()
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update ticket status
router.patch('/:id/status', authenticateToken, validateId, async (req, res) => {
  try {
    const { status, resolution } = req.body;

    if (!status || !['pending', 'approved', 'rejected', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user has access to update this ticket
    // Admins can update any ticket, others can only update tickets in their portal
    if (req.user.role !== 'admin' && req.user.portal !== ticket.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await ticket.updateStatus(status, resolution);

    // Log activity
    await Activity.logTicketActivity(
      ticket.id,
      'ticket_status_updated',
      `Ticket status updated to ${status}: ${ticket.title}`,
      req.user.full_name,
      req.user.portal,
      req.user.id
    );

    res.json({
      success: true,
      message: `Ticket status updated to ${status}`,
      data: ticket.toJSON()
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Assign ticket to officer (police officers only)
router.patch('/:id/assign', authenticateToken, authorizeRole(['police_officer', 'admin']), validateId, async (req, res) => {
  try {
    const { assignedOfficer } = req.body;

    if (!assignedOfficer) {
      return res.status(400).json({
        success: false,
        message: 'Assigned officer is required'
      });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user has access to assign this ticket
    if (req.user.role !== 'admin' && req.user.portal !== ticket.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await ticket.assignToOfficer(assignedOfficer);

    // Log activity
    await Activity.logTicketActivity(
      ticket.id,
      'ticket_assigned',
      `Ticket assigned to ${assignedOfficer}: ${ticket.title}`,
      req.user.full_name,
      req.user.portal,
      req.user.id
    );

    res.json({
      success: true,
      message: `Ticket assigned to ${assignedOfficer}`,
      data: ticket.toJSON()
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete ticket
router.delete('/:id', authenticateToken, validateId, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user has access to delete this ticket
    if (req.user.role !== 'admin' && req.user.portal !== ticket.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Regular users can only delete their own tickets
    if (req.user.role !== 'admin' && ticket.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own tickets'
      });
    }

    await ticket.delete();

    // Log activity
    await Activity.logTicketActivity(
      ticket.id,
      'ticket_deleted',
      `Ticket deleted: ${ticket.title}`,
      req.user.full_name,
      req.user.portal,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Approve user request (create user from ticket)
router.post('/:id/approve-user', authenticateToken, validateId, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if this is a user request ticket
    if (ticket.type !== 'user_request') {
      return res.status(400).json({
        success: false,
        message: 'This ticket is not a user request'
      });
    }

    // Check if user has access to approve this ticket
    if (req.user.role !== 'admin' && req.user.portal !== ticket.portal) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Parse user request data
    const userRequestData = ticket.userRequestData ? JSON.parse(ticket.userRequestData) : null;
    if (!userRequestData) {
      return res.status(400).json({
        success: false,
        message: 'No user data found in this request'
      });
    }

    // Create the user
    const User = require('../models/User');
    const newUser = await User.create({
      ...userRequestData,
      password: 'password123', // Default password
      role: 'admin', // Business users are admins
      portal: 'business',
      status: 'active'
    });

    // Update ticket status to approved
    await ticket.updateStatus('approved', 'User request approved and account created');

    // Log activity
    await Activity.logTicketActivity(
      ticket.id,
      'user_request_approved',
      `User request approved: ${newUser.fullName}`,
      req.user.full_name,
      req.user.portal,
      req.user.id
    );

    res.json({
      success: true,
      message: 'User request approved and account created successfully',
      data: {
        ticket: ticket.toJSON(),
        user: newUser.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('Approve user request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get ticket statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await Ticket.getStats(req.user.role !== 'admin' ? req.user.portal : null);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
