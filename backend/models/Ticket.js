const { v4: uuidv4 } = require('uuid');
const { runQuery, getQuery, allQuery } = require('../config/database');

class Ticket {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.type = data.type;
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.description = data.description;
    this.images = data.images ? JSON.stringify(data.images) : null;
    this.locationAddress = data.locationAddress || data.location_address;
    this.locationLat = data.locationLat || data.location_lat;
    this.locationLng = data.locationLng || data.location_lng;
    this.assignedOfficer = data.assignedOfficer || data.assigned_officer;
    this.resolution = data.resolution;
    this.portal = data.portal;
    this.userId = data.userId || data.user_id;
    this.userRequestData = data.userRequestData || data.user_request_data;
    this.createdAt = data.createdAt || data.created_at;
    this.updatedAt = data.updatedAt || data.updated_at;
    
    // User data (populated when needed)
    this.user = data.user;
  }

  // Create a new ticket
  static async create(ticketData) {
    const ticket = new Ticket(ticketData);

    const sql = `
      INSERT INTO tickets (
        id, title, type, status, priority, description, images,
        location_address, location_lat, location_lng, assigned_officer,
        resolution, portal, user_id, user_request_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await runQuery(sql, [
      ticket.id, ticket.title, ticket.type, ticket.status, ticket.priority,
      ticket.description, ticket.images, ticket.locationAddress, ticket.locationLat,
      ticket.locationLng, ticket.assignedOfficer, ticket.resolution, ticket.portal, 
      ticket.userId, ticket.userRequestData ? JSON.stringify(ticket.userRequestData) : null
    ]);

    return ticket;
  }

  // Find ticket by ID
  static async findById(id) {
    const sql = `
      SELECT t.*, u.full_name as user_name, u.email as user_email, u.phone as user_phone,
             u.id_card as user_id_card, u.department as user_department, u.position as user_position,
             u.address as user_address
      FROM tickets t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `;
    
    const row = await getQuery(sql, [id]);
    if (!row) return null;

    const ticket = new Ticket(row);
    ticket.user = {
      name: row.user_name,
      email: row.user_email,
      phone: row.user_phone,
      idCard: row.user_id_card,
      department: row.user_department,
      position: row.user_position,
      address: row.user_address
    };

    return ticket;
  }

  // Get all tickets with pagination and filters
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      type, 
      portal, 
      priority,
      userId 
    } = options;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let sql = `
      SELECT t.*, u.full_name as user_name, u.email as user_email, u.phone as user_phone,
             u.id_card as user_id_card, u.department as user_department, u.position as user_position,
             u.address as user_address
      FROM tickets t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }

    if (type) {
      sql += ' AND t.type = ?';
      params.push(type);
    }

    if (portal) {
      sql += ' AND t.portal = ?';
      params.push(portal);
    }

    if (priority) {
      sql += ' AND t.priority = ?';
      params.push(priority);
    }

    if (userId) {
      sql += ' AND t.user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const rows = await allQuery(sql, params);
    return rows.map(row => {
      const ticket = new Ticket(row);
      ticket.user = {
        name: row.user_name,
        email: row.user_email,
        phone: row.user_phone,
        idCard: row.user_id_card,
        department: row.user_department,
        position: row.user_position,
        address: row.user_address
      };
      return ticket;
    });
  }

  // Update ticket
  async update(updateData) {
    const allowedFields = [
      'title', 'type', 'status', 'priority', 'description', 'images',
      'locationAddress', 'locationLat', 'locationLng', 'assignedOfficer', 'resolution'
    ];

    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'images' && Array.isArray(value)) {
          updates.push('images = ?');
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
        } else if (key === 'assignedOfficer') {
          updates.push('assigned_officer = ?');
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
    const sql = `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`;

    await runQuery(sql, params);

    // Update local instance
    Object.assign(this, updateData);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Update ticket status
  async updateStatus(status, resolution = null) {
    const updateData = { status };
    if (resolution) {
      updateData.resolution = resolution;
    }
    return await this.update(updateData);
  }

  // Assign ticket to officer
  async assignToOfficer(officerName) {
    return await this.update({ assignedOfficer: officerName });
  }

  // Delete ticket
  async delete() {
    await runQuery('DELETE FROM tickets WHERE id = ?', [this.id]);
    return true;
  }

  // Get ticket statistics
  static async getStats(portal = null) {
    let sql = 'SELECT status, COUNT(*) as count FROM tickets';
    const params = [];

    if (portal) {
      sql += ' WHERE portal = ?';
      params.push(portal);
    }

    sql += ' GROUP BY status';

    const statusStats = await allQuery(sql, params);

    // Get type statistics
    let typeSql = 'SELECT type, COUNT(*) as count FROM tickets';
    if (portal) {
      typeSql += ' WHERE portal = ?';
    }
    typeSql += ' GROUP BY type';

    const typeStats = await allQuery(typeSql, params);

    // Get total counts
    let totalSql = 'SELECT COUNT(*) as total FROM tickets';
    if (portal) {
      totalSql += ' WHERE portal = ?';
    }

    const totalResult = await getQuery(totalSql, params);
    const total = totalResult.total;

    return {
      total,
      statusStats,
      typeStats
    };
  }

  // Convert to JSON
  toJSON() {
    const ticketData = { ...this };
    if (ticketData.images) {
      try {
        ticketData.images = JSON.parse(ticketData.images);
      } catch (e) {
        ticketData.images = [];
      }
    }

    if (ticketData.user) {
      ticketData.user = {
        name: ticketData.user.name,
        email: ticketData.user.email,
        phone: ticketData.user.phone,
        idCard: ticketData.user.idCard,
        department: ticketData.user.department,
        position: ticketData.user.position,
        address: ticketData.user.address
      };
    }

    return {
      id: ticketData.id,
      title: ticketData.title,
      type: ticketData.type,
      status: ticketData.status,
      priority: ticketData.priority,
      createdAt: ticketData.createdAt,
      updatedAt: ticketData.updatedAt,
      user: ticketData.user,
      description: ticketData.description,
      images: ticketData.images,
      location: ticketData.locationAddress ? {
        address: ticketData.locationAddress,
        coordinates: ticketData.locationLat && ticketData.locationLng ? {
          lat: ticketData.locationLat,
          lng: ticketData.locationLng
        } : undefined
      } : undefined,
      assignedOfficer: ticketData.assignedOfficer,
      resolution: ticketData.resolution,
      portal: ticketData.portal
    };
  }
}

module.exports = Ticket;
