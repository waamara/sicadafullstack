const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUser = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('idCard').isLength({ min: 8, max: 20 }).withMessage('ID card must be between 8 and 20 characters'),
  body('role').isIn(['employee', 'police_officer', 'admin', 'citizen']).withMessage('Invalid role'),
  body('portal').isIn(['business', 'police', 'wilaya', 'citizen']).withMessage('Invalid portal'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  handleValidationErrors
];

// User update validation rules (all fields optional)
const validateUserUpdate = [
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('idCard').optional().isLength({ min: 8, max: 20 }).withMessage('ID card must be between 8 and 20 characters'),
  body('role').optional().isIn(['employee', 'police_officer', 'admin', 'citizen']).withMessage('Invalid role'),
  body('portal').optional().isIn(['business', 'police', 'wilaya', 'citizen']).withMessage('Invalid portal'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['employee', 'police_officer', 'admin']).withMessage('Invalid role'),
  handleValidationErrors
];

// Ticket validation rules
const validateTicket = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('type').isIn(['parking', 'equipment', 'access', 'complaint', 'violation', 'other']).withMessage('Invalid ticket type'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  body('portal').isIn(['business', 'police', 'wilaya']).withMessage('Invalid portal'),
  handleValidationErrors
];

const validateTicketUpdate = [
  body('status').optional().isIn(['pending', 'approved', 'rejected', 'in_progress', 'resolved']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('resolution').optional().trim().isLength({ max: 1000 }).withMessage('Resolution must not exceed 1000 characters'),
  handleValidationErrors
];

// Parking request validation rules
const validateParkingRequest = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('location.address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('location.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('requester.name').trim().isLength({ min: 2, max: 100 }).withMessage('Requester name must be between 2 and 100 characters'),
  body('requester.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('requester.phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('requester.idCard').isLength({ min: 8, max: 20 }).withMessage('ID card must be between 8 and 20 characters'),
  body('requestedSpaces').isInt({ min: 1, max: 1000 }).withMessage('Requested spaces must be between 1 and 1000'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  handleValidationErrors
];

const validateParkingRequestUpdate = [
  body('status').isIn(['pending', 'approved', 'rejected', 'in_review']).withMessage('Invalid status'),
  body('reviewNotes').optional().trim().isLength({ max: 1000 }).withMessage('Review notes must not exceed 1000 characters'),
  handleValidationErrors
];

// Parking location validation rules
const validateParkingLocation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('totalSpaces').isInt({ min: 1, max: 10000 }).withMessage('Total spaces must be between 1 and 10000'),
  body('availableSpaces').isInt({ min: 0 }).withMessage('Available spaces must be non-negative'),
  body('hourlyRate').isFloat({ min: 0 }).withMessage('Hourly rate must be non-negative'),
  body('dailyRate').isFloat({ min: 0 }).withMessage('Daily rate must be non-negative'),
  body('monthlyRate').isFloat({ min: 0 }).withMessage('Monthly rate must be non-negative'),
  body('status').optional().isIn(['active', 'inactive', 'maintenance', 'full']).withMessage('Invalid status'),
  handleValidationErrors
];

// Parameter validation
const validateId = [
  param('id').isUUID().withMessage('Invalid ID format'),
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateUserUpdate,
  validateLogin,
  validateTicket,
  validateTicketUpdate,
  validateParkingRequest,
  validateParkingRequestUpdate,
  validateParkingLocation,
  validateId,
  validatePagination,
  handleValidationErrors
};
