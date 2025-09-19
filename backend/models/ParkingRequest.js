const { v4: uuidv4 } = require('uuid');
const { runQuery, getQuery, allQuery } = require('../config/database');

class ParkingRequest {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.locationAddress = data.locationAddress || data.location_address;
    this.locationLat = data.locationLat || data.location_lat;
    this.locationLng = data.locationLng || data.location_lng;
    this.requesterName = data.requesterName || data.requester_name;
    this.requesterEmail = data.requesterEmail || data.requester_email;
    this.requesterPhone = data.requesterPhone || data.requester_phone;
    this.requesterIdCard = data.requesterIdCard || data.requester_id_card;
    this.requesterOrganization = data.requesterOrganization || data.requester_organization;
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.requestedSpaces = data.requestedSpaces || data.requested_spaces;
    this.estimatedCost = data.estimatedCost || data.estimated_cost;
    this.documents = data.documents ? JSON.stringify(data.documents) : null;
    this.reviewedBy = data.reviewedBy || data.reviewed_by;
    this.reviewNotes = data.reviewNotes || data.review_notes;
    this.createdAt = data.createdAt || data.created_at;
    this.updatedAt = data.updatedAt || data.updated_at;
  }

  // Create a new parking request
  static async create(requestData) {
    const request = new ParkingRequest(requestData);

    const sql = `
      INSERT INTO parking_requests (
        id, title, description, location_address, location_lat, location_lng,
        requester_name, requester_email, requester_phone, requester_id_card,
        requester_organization, status, priority, requested_spaces, estimated_cost,
        documents, reviewed_by, review_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await runQuery(sql, [
      request.id, request.title, request.description, request.locationAddress,
      request.locationLat, request.locationLng, request.requesterName,
      request.requesterEmail, request.requesterPhone, request.requesterIdCard,
      request.requesterOrganization, request.status, request.priority,
      request.requestedSpaces, request.estimatedCost, request.documents,
      request.reviewedBy, request.reviewNotes
    ]);

    return request;
  }

  // Find parking request by ID
  static async findById(id) {
    const row = await getQuery('SELECT * FROM parking_requests WHERE id = ?', [id]);
    return row ? new ParkingRequest(row) : null;
  }

  // Get all parking requests with pagination and filters
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      priority 
    } = options;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let sql = 'SELECT * FROM parking_requests WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      sql += ' AND priority = ?';
      params.push(priority);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const rows = await allQuery(sql, params);
    return rows.map(row => new ParkingRequest(row));
  }

  // Update parking request
  async update(updateData) {
    const allowedFields = [
      'title', 'description', 'locationAddress', 'locationLat', 'locationLng',
      'requesterName', 'requesterEmail', 'requesterPhone', 'requesterIdCard',
      'requesterOrganization', 'status', 'priority', 'requestedSpaces',
      'estimatedCost', 'documents', 'reviewedBy', 'reviewNotes'
    ];

    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'documents' && Array.isArray(value)) {
          updates.push('documents = ?');
          params.push(JSON.stringify(value));
        } else if (key === 'locationAddress') {
          updates.push('location_address = ?');
          params.push(value);
        } else if (key === 'locationLat') {
          updates.push('location_lat = ?');
          params.push(value);
        } else if (key === 'locationLng') {
          updates.push('location_lng = ?');
          params.push(value);
        } else if (key === 'requesterName') {
          updates.push('requester_name = ?');
          params.push(value);
        } else if (key === 'requesterEmail') {
          updates.push('requester_email = ?');
          params.push(value);
        } else if (key === 'requesterPhone') {
          updates.push('requester_phone = ?');
          params.push(value);
        } else if (key === 'requesterIdCard') {
          updates.push('requester_id_card = ?');
          params.push(value);
        } else if (key === 'requesterOrganization') {
          updates.push('requester_organization = ?');
          params.push(value);
        } else if (key === 'requestedSpaces') {
          updates.push('requested_spaces = ?');
          params.push(value);
        } else if (key === 'estimatedCost') {
          updates.push('estimated_cost = ?');
          params.push(value);
        } else if (key === 'reviewedBy') {
          updates.push('reviewed_by = ?');
          params.push(value);
        } else if (key === 'reviewNotes') {
          updates.push('review_notes = ?');
          params.push(value);
        } else {
          updates.push(`${key} = ?`);
          params.push(value);
        }
      }
    }

    if (updates.length === 0) {
      return this;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(this.id);
    const sql = `UPDATE parking_requests SET ${updates.join(', ')} WHERE id = ?`;

    await runQuery(sql, params);

    // Update local instance
    Object.assign(this, updateData);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Update parking request status
  async updateStatus(status, reviewNotes = null, reviewedBy = null) {
    const updateData = { status };
    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }
    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
    }
    return await this.update(updateData);
  }

  // Delete parking request
  async delete() {
    await runQuery('DELETE FROM parking_requests WHERE id = ?', [this.id]);
    return true;
  }

  // Get parking request statistics
  static async getStats() {
    const statusStats = await allQuery('SELECT status, COUNT(*) as count FROM parking_requests GROUP BY status');
    const priorityStats = await allQuery('SELECT priority, COUNT(*) as count FROM parking_requests GROUP BY priority');
    const totalResult = await getQuery('SELECT COUNT(*) as total FROM parking_requests');
    const totalSpacesResult = await getQuery('SELECT SUM(requested_spaces) as total_spaces FROM parking_requests WHERE status = "approved"');

    return {
      total: totalResult.total,
      totalApprovedSpaces: totalSpacesResult.total_spaces || 0,
      statusStats,
      priorityStats
    };
  }

  // Convert to JSON
  toJSON() {
    const requestData = { ...this };
    if (requestData.documents) {
      try {
        requestData.documents = JSON.parse(requestData.documents);
      } catch (e) {
        requestData.documents = [];
      }
    } else {
      requestData.documents = [];
    }

    return {
      id: requestData.id,
      title: requestData.title,
      description: requestData.description,
      location: {
        address: requestData.locationAddress,
        coordinates: requestData.locationLat && requestData.locationLng ? {
          lat: requestData.locationLat,
          lng: requestData.locationLng
        } : undefined
      },
      requester: {
        name: requestData.requesterName,
        email: requestData.requesterEmail,
        phone: requestData.requesterPhone,
        idCard: requestData.requesterIdCard,
        organization: requestData.requesterOrganization
      },
      status: requestData.status,
      priority: requestData.priority,
      requestedSpaces: requestData.requestedSpaces,
      estimatedCost: requestData.estimatedCost,
      documents: requestData.documents,
      createdAt: requestData.createdAt,
      updatedAt: requestData.updatedAt,
      reviewedBy: requestData.reviewedBy,
      reviewNotes: requestData.reviewNotes
    };
  }
}

module.exports = ParkingRequest;
