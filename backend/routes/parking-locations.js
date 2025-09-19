const express = require('express');
const ParkingLocation = require('../models/ParkingLocation');
const Activity = require('../models/Activity');
const { authenticateToken, authorizeRole, authorizePortal } = require('../middleware/auth');
const { validateParkingLocation, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Get all parking locations
router.get('/', authenticateToken, authorizePortal(['wilaya']), validatePagination, async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const options = { 
      page: parseInt(page), 
      limit: parseInt(limit), 
      status
    };
    
    const locations = await ParkingLocation.findAll(options);
    const stats = await ParkingLocation.getStats();

    res.json({
      success: true,
      data: locations.map(location => location.toJSON()),
      stats
    });
  } catch (error) {
    console.error('Get parking locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get parking location by ID
router.get('/:id', authenticateToken, authorizePortal(['wilaya']), validateId, async (req, res) => {
  try {
    const location = await ParkingLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found'
      });
    }

    res.json({
      success: true,
      data: location.toJSON()
    });
  } catch (error) {
    console.error('Get parking location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new parking location
router.post('/', authenticateToken, authorizePortal(['wilaya']), validateParkingLocation, async (req, res) => {
  try {
    const locationData = req.body;
    const currentUser = req.user;

    const location = await ParkingLocation.create(locationData);

    // Log activity
    await Activity.logSystemActivity(
      'parking_location_created',
      `New parking location created: ${location.name}`,
      currentUser.portal
    );

    res.status(201).json({
      success: true,
      data: location.toJSON(),
      message: 'Parking location created successfully'
    });
  } catch (error) {
    console.error('Create parking location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update full parking location
router.put('/:id', authenticateToken, authorizePortal(['wilaya']), validateId, validateParkingLocation, async (req, res) => {
  try {
    const location = await ParkingLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found'
      });
    }

    const updateData = req.body;
    await location.update(updateData);

    // Log activity
    await Activity.logSystemActivity(
      'parking_location_updated',
      `Parking location updated: ${location.name}`,
      req.user.portal
    );

    res.json({
      success: true,
      data: location.toJSON(),
      message: 'Parking location updated successfully'
    });
  } catch (error) {
    console.error('Update parking location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


// Update parking location
router.put('/:id', authenticateToken, authorizePortal(['wilaya']), validateId, validateParkingLocation, async (req, res) => {
  try {
    const location = await ParkingLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found'
      });
    }

    await location.update(req.body);

    // Log activity
    await Activity.logSystemActivity(
      'parking_location_updated',
      `Parking location updated: ${location.name}`,
      'wilaya'
    );

    res.json({
      success: true,
      message: 'Parking location updated successfully',
      data: location.toJSON()
    });
  } catch (error) {
    console.error('Update parking location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update parking location available spaces
router.patch('/:id/spaces', authenticateToken, authorizePortal(['wilaya']), validateId, async (req, res) => {
  try {
    const { availableSpaces } = req.body;

    if (typeof availableSpaces !== 'number' || availableSpaces < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid available spaces count is required'
      });
    }

    const location = await ParkingLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found'
      });
    }

    if (availableSpaces > location.totalSpaces) {
      return res.status(400).json({
        success: false,
        message: 'Available spaces cannot exceed total spaces'
      });
    }

    await location.updateAvailableSpaces(availableSpaces);

    // Log activity
    await Activity.logSystemActivity(
      'parking_spaces_updated',
      `Parking spaces updated for ${location.name}: ${availableSpaces}/${location.totalSpaces}`,
      'wilaya'
    );

    res.json({
      success: true,
      message: 'Available spaces updated successfully',
      data: location.toJSON()
    });
  } catch (error) {
    console.error('Update parking spaces error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update parking location status
router.patch('/:id/status', authenticateToken, authorizePortal(['wilaya']), validateId, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'maintenance', 'full'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (active, inactive, maintenance, full)'
      });
    }

    const location = await ParkingLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found'
      });
    }

    await location.updateStatus(status);

    // Log activity
    await Activity.logSystemActivity(
      'parking_status_updated',
      `Parking status updated to ${status} for ${location.name}`,
      'wilaya'
    );

    res.json({
      success: true,
      message: `Parking location status updated to ${status}`,
      data: location.toJSON()
    });
  } catch (error) {
    console.error('Update parking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete parking location (admin only)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), validateId, async (req, res) => {
  try {
    const location = await ParkingLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found'
      });
    }

    await location.delete();

    // Log activity
    await Activity.logSystemActivity(
      'parking_location_deleted',
      `Parking location deleted: ${location.name}`,
      'wilaya'
    );

    res.json({
      success: true,
      message: 'Parking location deleted successfully'
    });
  } catch (error) {
    console.error('Delete parking location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get parking location statistics
router.get('/stats/overview', authenticateToken, authorizePortal(['wilaya']), async (req, res) => {
  try {
    const stats = await ParkingLocation.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get parking location stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
