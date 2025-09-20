const express = require('express');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const ParkingRequest = require('../models/ParkingRequest');
const ParkingLocation = require('../models/ParkingLocation');
const Activity = require('../models/Activity');
const { authenticateToken, authorizePortal } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let stats = {};

    if (user.role === 'admin') {
      // Admin gets all statistics
      const [userStats, ticketStats, parkingRequestStats, parkingLocationStats, recentActivities] = await Promise.all([
        User.getStats(),
        Ticket.getStats(),
        ParkingRequest.getStats(),
        ParkingLocation.getStats(),
        Activity.getRecent(10)
      ]);

      stats = {
        totalUsers: userStats.totalUsers,
        activeUsers: userStats.activeUsers,
        pendingTickets: ticketStats.statusStats.find(s => s.status === 'pending')?.count || 0,
        resolvedTickets: ticketStats.statusStats.filter(s => ['approved', 'rejected', 'resolved'].includes(s.status)).reduce((sum, s) => sum + s.count, 0),
        totalTickets: ticketStats.total,
        recentActivity: recentActivities.map(activity => activity.toJSON())
      };
    } else {
      // Portal-specific statistics
      const [ticketStats, recentActivities] = await Promise.all([
        Ticket.getStats(user.portal),
        Activity.getRecent(5)
      ]);

      if (user.portal === 'wilaya') {
        const [parkingRequestStats, parkingLocationStats] = await Promise.all([
          ParkingRequest.getStats(),
          ParkingLocation.getStats()
        ]);

        stats = {
          totalUsers: 0, // Wilaya doesn't manage users directly
          activeUsers: 0,
          pendingTickets: ticketStats.statusStats.find(s => s.status === 'pending')?.count || 0,
          resolvedTickets: ticketStats.statusStats.filter(s => ['approved', 'rejected', 'resolved'].includes(s.status)).reduce((sum, s) => sum + s.count, 0),
          totalTickets: ticketStats.total,
          parkingRequests: parkingRequestStats.total,
          pendingParkingRequests: parkingRequestStats.statusStats.find(s => s.status === 'pending')?.count || 0,
          approvedParkingRequests: parkingRequestStats.statusStats.find(s => s.status === 'approved')?.count || 0,
          totalParkingLocations: parkingLocationStats.total,
          activeParkingLocations: parkingLocationStats.statusStats.find(s => s.status === 'active')?.count || 0,
          totalSpaces: parkingLocationStats.totalSpaces,
          availableSpaces: parkingLocationStats.availableSpaces,
          recentActivity: recentActivities.map(activity => activity.toJSON())
        };
      } else {
        // Business and Police portals
        stats = {
          totalUsers: 0,
          activeUsers: 0,
          pendingTickets: ticketStats.statusStats.find(s => s.status === 'pending')?.count || 0,
          resolvedTickets: ticketStats.statusStats.filter(s => ['approved', 'rejected', 'resolved'].includes(s.status)).reduce((sum, s) => sum + s.count, 0),
          totalTickets: ticketStats.total,
          recentActivity: recentActivities.map(activity => activity.toJSON())
        };
      }
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get wilaya-specific dashboard data
router.get('/wilaya', authenticateToken, authorizePortal(['wilaya']), async (req, res) => {
  try {
    const [parkingRequests, parkingLocations, parkingRequestStats, parkingLocationStats] = await Promise.all([
      ParkingRequest.findAll({ limit: 5 }),
      ParkingLocation.findAll({ limit: 5 }),
      ParkingRequest.getStats(),
      ParkingLocation.getStats()
    ]);

    const dashboardData = {
      parkingRequests: parkingRequests.map(request => request.toJSON()),
      parkingLocations: parkingLocations.map(location => location.toJSON()),
      stats: {
        totalParkingRequests: parkingRequestStats.total,
        pendingParkingRequests: parkingRequestStats.statusStats.find(s => s.status === 'pending')?.count || 0,
        approvedParkingRequests: parkingRequestStats.statusStats.find(s => s.status === 'approved')?.count || 0,
        totalParkingLocations: parkingLocationStats.total,
        activeParkingLocations: parkingLocationStats.statusStats.find(s => s.status === 'active')?.count || 0,
        totalSpaces: parkingLocationStats.totalSpaces,
        availableSpaces: parkingLocationStats.availableSpaces
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get wilaya dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get business portal dashboard data
router.get('/business', authenticateToken, authorizePortal(['business']), async (req, res) => {
  try {
    const [tickets, ticketStats] = await Promise.all([
      Ticket.findAll({ userId: req.user.id, limit: 5 }),
      Ticket.getStats('business')
    ]);

    const dashboardData = {
      tickets: tickets.map(ticket => ticket.toJSON()),
      stats: {
        totalTickets: ticketStats.total,
        pendingTickets: ticketStats.statusStats.find(s => s.status === 'pending')?.count || 0,
        approvedTickets: ticketStats.statusStats.find(s => s.status === 'approved')?.count || 0,
        rejectedTickets: ticketStats.statusStats.find(s => s.status === 'rejected')?.count || 0
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get business dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get police portal dashboard data
router.get('/police', authenticateToken, authorizePortal(['police']), async (req, res) => {
  try {
    const [tickets, ticketStats] = await Promise.all([
      Ticket.findAll({ portal: 'police', limit: 5 }),
      Ticket.getStats('police')
    ]);

    const dashboardData = {
      tickets: tickets.map(ticket => ticket.toJSON()),
      stats: {
        totalTickets: ticketStats.total,
        pendingTickets: ticketStats.statusStats.find(s => s.status === 'pending')?.count || 0,
        inProgressTickets: ticketStats.statusStats.find(s => s.status === 'in_progress')?.count || 0,
        resolvedTickets: ticketStats.statusStats.find(s => s.status === 'resolved')?.count || 0,
        complaints: ticketStats.typeStats.find(t => t.type === 'complaint')?.count || 0,
        violations: ticketStats.typeStats.find(t => t.type === 'violation')?.count || 0
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get police dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;


