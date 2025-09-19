const express = require('express');
const ParkingRequest = require('../models/ParkingRequest');
const Activity = require('../models/Activity');
const { authenticateToken, authorizeRole, authorizePortal } = require('../middleware/auth');
const { validateParkingRequest, validateParkingRequestUpdate, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Get all parking requests
router.get('/', authenticateToken, authorizePortal(['wilaya']), validatePagination, async (req, res) => {
  try {
    const { page, limit, status, priority } = req.query;
    const options = { 
      page: parseInt(page), 
      limit: parseInt(limit), 
      status, 
      priority
    };
    
    const requests = await ParkingRequest.findAll(options);
    const stats = await ParkingRequest.getStats();

    res.json({
      success: true,
      data: requests.map(request => request.toJSON()),
      stats
    });
  } catch (error) {
    console.error('Get parking requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get parking request by ID
router.get('/:id', authenticateToken, authorizePortal(['wilaya']), validateId, async (req, res) => {
  try {
    const request = await ParkingRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Parking request not found'
      });
    }

    res.json({
      success: true,
      data: request.toJSON()
    });
  } catch (error) {
    console.error('Get parking request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new parking request
router.post('/', authenticateToken, validateParkingRequest, async (req, res) => {
  try {
    const requestData = req.body;
    const currentUser = req.user;

    // Map nested location data to flat structure
    const flatRequestData = {
      title: requestData.title,
      description: requestData.description,
      locationAddress: requestData.location?.address || '',
      locationLat: requestData.location?.lat || null,
      locationLng: requestData.location?.lng || null,
      requesterName: requestData.requester?.name || currentUser.full_name,
      requesterEmail: requestData.requester?.email || currentUser.email,
      requesterPhone: requestData.requester?.phone || currentUser.phone,
      requesterIdCard: requestData.requester?.idCard || currentUser.id_card,
      requesterOrganization: requestData.requester?.organization || '',
      requestedSpaces: requestData.requestedSpaces,
      estimatedCost: requestData.estimatedCost || null,
      priority: requestData.priority || 'medium',
      status: 'pending'
    };

    const request = await ParkingRequest.create(flatRequestData);

    // Log activity
    await Activity.logSystemActivity(
      'parking_request_created',
      `New parking request created: ${request.title}`,
      currentUser.portal
    );

    res.status(201).json({
      success: true,
      data: request.toJSON(),
      message: 'Parking request created successfully'
    });
  } catch (error) {
    console.error('Create parking request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update full parking request
router.put('/:id', authenticateToken, authorizePortal(['wilaya']), validateId, validateParkingRequest, async (req, res) => {
  try {
    const request = await ParkingRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Parking request not found'
      });
    }

    const updateData = req.body;
    await request.update(updateData);

    // Log activity
    await Activity.logSystemActivity(
      'parking_request_updated',
      `Parking request updated: ${request.title}`,
      req.user.portal
    );

    res.json({
      success: true,
      data: request.toJSON(),
      message: 'Parking request updated successfully'
    });
  } catch (error) {
    console.error('Update parking request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new parking request
router.post('/', authenticateToken, validateParkingRequest, async (req, res) => {
  try {
    const requestData = req.body;
    const request = await ParkingRequest.create(requestData);

    // Log activity
    await Activity.logSystemActivity(
      'parking_request_created',
      `New parking request created: ${request.title}`,
      'wilaya'
    );

    res.status(201).json({
      success: true,
      message: 'Parking request created successfully',
      data: request.toJSON()
    });
  } catch (error) {
    console.error('Create parking request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update parking request
router.put('/:id', authenticateToken, authorizePortal(['wilaya']), validateId, validateParkingRequest, async (req, res) => {
  try {
    const request = await ParkingRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Parking request not found'
      });
    }

    await request.update(req.body);

    // Log activity
    await Activity.logSystemActivity(
      'parking_request_updated',
      `Parking request updated: ${request.title}`,
      'wilaya'
    );

    res.json({
      success: true,
      message: 'Parking request updated successfully',
      data: request.toJSON()
    });
  } catch (error) {
    console.error('Update parking request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update parking request status (admin only)
router.patch('/:id/status', authenticateToken, authorizeRole(['admin']), validateId, validateParkingRequestUpdate, async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    const request = await ParkingRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Parking request not found'
      });
    }

    await request.updateStatus(status, reviewNotes, req.user.full_name);

    // Log activity
    await Activity.logSystemActivity(
      'parking_request_status_updated',
      `Parking request status updated to ${status}: ${request.title}`,
      'wilaya'
    );

    res.json({
      success: true,
      message: `Parking request status updated to ${status}`,
      data: request.toJSON()
    });
  } catch (error) {
    console.error('Update parking request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete parking request (admin only)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), validateId, async (req, res) => {
  try {
    const request = await ParkingRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Parking request not found'
      });
    }

    await request.delete();

    // Log activity
    await Activity.logSystemActivity(
      'parking_request_deleted',
      `Parking request deleted: ${request.title}`,
      'wilaya'
    );

    res.json({
      success: true,
      message: 'Parking request deleted successfully'
    });
  } catch (error) {
    console.error('Delete parking request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get parking request statistics
router.get('/stats/overview', authenticateToken, authorizePortal(['wilaya']), async (req, res) => {
  try {
    const stats = await ParkingRequest.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get parking request stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
