const { v4: uuidv4 } = require('uuid');
const { runQuery, getQuery, allQuery } = require('../config/database');

class Activity {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.type = data.type;
    this.description = data.description;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.userName = data.userName || data.user_name;
    this.portal = data.portal;
    this.ticketId = data.ticketId || data.ticket_id;
    this.userId = data.userId || data.user_id;
  }

  // Create a new activity
  static async create(activityData) {
    const activity = new Activity(activityData);

    const sql = `
      INSERT INTO activities (
        id, type, description, timestamp, user_name, portal, ticket_id, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await runQuery(sql, [
      activity.id, activity.type, activity.description, activity.timestamp,
      activity.userName, activity.portal, activity.ticketId, activity.userId
    ]);

    return activity;
  }

  // Find activity by ID
  static async findById(id) {
    const row = await getQuery('SELECT * FROM activities WHERE id = ?', [id]);
    return row ? new Activity(row) : null;
  }

  // Get all activities with pagination and filters
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      portal,
      userId,
      ticketId
    } = options;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let sql = 'SELECT * FROM activities WHERE 1=1';
    const params = [];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (portal) {
      sql += ' AND portal = ?';
      params.push(portal);
    }

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (ticketId) {
      sql += ' AND ticket_id = ?';
      params.push(ticketId);
    }

    sql += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const rows = await allQuery(sql, params);
    return rows.map(row => new Activity(row));
  }

  // Get recent activities
  static async getRecent(limit = 10) {
    const sql = 'SELECT * FROM activities ORDER BY timestamp DESC LIMIT ?';
    const rows = await allQuery(sql, [limit]);
    return rows.map(row => new Activity(row));
  }

  // Log ticket activity
  static async logTicketActivity(ticketId, type, description, userName, portal, userId = null) {
    return await Activity.create({
      type,
      description,
      ticketId,
      userName,
      portal,
      userId
    });
  }

  // Log user activity
  static async logUserActivity(userId, type, description, userName, portal) {
    return await Activity.create({
      type,
      description,
      userId,
      userName,
      portal
    });
  }

  // Log system activity
  static async logSystemActivity(type, description, portal) {
    return await Activity.create({
      type,
      description,
      portal
    });
  }

  // Delete activity
  async delete() {
    await runQuery('DELETE FROM activities WHERE id = ?', [this.id]);
    return true;
  }

  // Get activity statistics
  static async getStats(portal = null) {
    let sql = 'SELECT type, COUNT(*) as count FROM activities';
    const params = [];

    if (portal) {
      sql += ' WHERE portal = ?';
      params.push(portal);
    }

    sql += ' GROUP BY type';

    const typeStats = await allQuery(sql, params);

    // Get total count
    let totalSql = 'SELECT COUNT(*) as total FROM activities';
    if (portal) {
      totalSql += ' WHERE portal = ?';
    }

    const totalResult = await getQuery(totalSql, params);
    const total = totalResult.total;

    return {
      total,
      typeStats
    };
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      description: this.description,
      timestamp: this.timestamp,
      user: this.userName,
      portal: this.portal
    };
  }
}

module.exports = Activity;
