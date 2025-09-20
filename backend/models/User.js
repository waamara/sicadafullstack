const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { runQuery, getQuery, allQuery } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.fullName = data.fullName || data.full_name;
    this.email = data.email;
    this.phone = data.phone;
    this.idCard = data.idCard || data.id_card;
    this.passwordHash = data.passwordHash || data.password_hash;
    this.department = data.department;
    this.position = data.position;
    this.address = data.address;
    this.status = data.status || 'active';
    this.role = data.role;
    this.portal = data.portal;
    this.badgeNumber = data.badgeNumber || data.badge_number;
    this.rank = data.rank;
    this.station = data.station;
    this.avatar = data.avatar;
    this.createdAt = data.createdAt || data.created_at;
    this.lastLogin = data.lastLogin || data.last_login;
  }

  // Create a new user
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = new User({
      ...userData,
      passwordHash: hashedPassword
    });

    const sql = `
      INSERT INTO users (
        id, full_name, email, phone, id_card, password_hash,
        department, position, address, status, role, portal,
        badge_number, rank, station, avatar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await runQuery(sql, [
      user.id, user.fullName, user.email, user.phone, user.idCard, user.passwordHash,
      user.department, user.position, user.address, user.status, user.role, user.portal,
      user.badgeNumber, user.rank, user.station, user.avatar
    ]);

    return user;
  }

  // Find user by ID
  static async findById(id) {
    const row = await getQuery('SELECT * FROM users WHERE id = ?', [id]);
    return row ? new User(row) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const row = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
    return row ? new User(row) : null;
  }

  // Find user by ID card
  static async findByIdCard(idCard) {
    const row = await getQuery('SELECT * FROM users WHERE id_card = ?', [idCard]);
    return row ? new User(row) : null;
  }

  // Get all users with pagination
  static async findAll(options = {}) {
    const { page = 1, limit = 10, role, portal, status } = options;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let sql = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    if (portal) {
      sql += ' AND portal = ?';
      params.push(portal);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const rows = await allQuery(sql, params);
    return rows.map(row => new User(row));
  }

  // Update user
  async update(updateData) {
    const allowedFields = [
      'fullName', 'email', 'phone', 'department', 'position', 'address',
      'status', 'badgeNumber', 'rank', 'station', 'avatar'
    ];

    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key === 'fullName' ? 'full_name' : key === 'badgeNumber' ? 'badge_number' : key} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      return this;
    }

    params.push(this.id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    await runQuery(sql, params);

    // Update local instance
    Object.assign(this, updateData);
    return this;
  }

  // Update password
  async updatePassword(newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await runQuery('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, this.id]);
    this.passwordHash = hashedPassword;
    return this;
  }

  // Update last login
  async updateLastLogin() {
    await runQuery('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [this.id]);
    this.lastLogin = new Date().toISOString();
    return this;
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }

  // Delete user
  async delete() {
    await runQuery('DELETE FROM users WHERE id = ?', [this.id]);
    return true;
  }

  // Get user statistics
  static async getStats() {
    const totalUsers = await getQuery('SELECT COUNT(*) as count FROM users');
    const activeUsers = await getQuery('SELECT COUNT(*) as count FROM users WHERE status = "active"');
    const usersByRole = await allQuery('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    const usersByPortal = await allQuery('SELECT portal, COUNT(*) as count FROM users GROUP BY portal');

    return {
      totalUsers: totalUsers.count,
      activeUsers: activeUsers.count,
      usersByRole,
      usersByPortal
    };
  }

  // Convert to JSON (exclude sensitive data)
  toJSON() {
    const { passwordHash, ...userData } = this;
    return userData;
  }

  // Convert to public JSON (exclude sensitive data)
  toPublicJSON() {
    const { passwordHash, ...userData } = this;
    return {
      id: userData.id,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      idCard: userData.idCard,
      department: userData.department,
      position: userData.position,
      address: userData.address,
      status: userData.status,
      role: userData.role,
      portal: userData.portal,
      badgeNumber: userData.badgeNumber,
      rank: userData.rank,
      station: userData.station,
      avatar: userData.avatar,
      createdAt: userData.createdAt,
      lastLogin: userData.lastLogin
    };
  }
}

module.exports = User;
