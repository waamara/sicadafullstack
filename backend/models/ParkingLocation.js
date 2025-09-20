const { v4: uuidv4 } = require('uuid');
const { runQuery, getQuery, allQuery } = require('../config/database');

class ParkingLocation {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.address = data.address;
    this.lat = data.lat;
    this.lng = data.lng;
    this.totalSpaces = data.totalSpaces || data.total_spaces;
    this.availableSpaces = data.availableSpaces || data.available_spaces;
    this.hourlyRate = data.hourlyRate || data.hourly_rate;
    this.dailyRate = data.dailyRate || data.daily_rate;
    this.monthlyRate = data.monthlyRate || data.monthly_rate;
    this.features = data.features ? JSON.stringify(data.features) : null;
    this.status = data.status || 'active';
    this.openingHoursMonday = data.openingHoursMonday || data.opening_hours_monday;
    this.openingHoursTuesday = data.openingHoursTuesday || data.opening_hours_tuesday;
    this.openingHoursWednesday = data.openingHoursWednesday || data.opening_hours_wednesday;
    this.openingHoursThursday = data.openingHoursThursday || data.opening_hours_thursday;
    this.openingHoursFriday = data.openingHoursFriday || data.opening_hours_friday;
    this.openingHoursSaturday = data.openingHoursSaturday || data.opening_hours_saturday;
    this.openingHoursSunday = data.openingHoursSunday || data.opening_hours_sunday;
    this.contactPhone = data.contactPhone || data.contact_phone;
    this.contactEmail = data.contactEmail || data.contact_email;
    this.managerName = data.managerName || data.manager_name;
    this.managerPhone = data.managerPhone || data.manager_phone;
    this.managerEmail = data.managerEmail || data.manager_email;
    this.createdAt = data.createdAt || data.created_at;
    this.updatedAt = data.updatedAt || data.updated_at;
  }

  // Create a new parking location
  static async create(locationData) {
    const location = new ParkingLocation(locationData);

    const sql = `
      INSERT INTO parking_locations (
        id, name, address, lat, lng, total_spaces, available_spaces,
        hourly_rate, daily_rate, monthly_rate, features, status,
        opening_hours_monday, opening_hours_tuesday, opening_hours_wednesday,
        opening_hours_thursday, opening_hours_friday, opening_hours_saturday,
        opening_hours_sunday, contact_phone, contact_email, manager_name,
        manager_phone, manager_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await runQuery(sql, [
      location.id, location.name, location.address, location.lat, location.lng,
      location.totalSpaces, location.availableSpaces, location.hourlyRate,
      location.dailyRate, location.monthlyRate, location.features, location.status,
      location.openingHoursMonday, location.openingHoursTuesday, location.openingHoursWednesday,
      location.openingHoursThursday, location.openingHoursFriday, location.openingHoursSaturday,
      location.openingHoursSunday, location.contactPhone, location.contactEmail,
      location.managerName, location.managerPhone, location.managerEmail
    ]);

    return location;
  }

  // Find parking location by ID
  static async findById(id) {
    const row = await getQuery('SELECT * FROM parking_locations WHERE id = ?', [id]);
    return row ? new ParkingLocation(row) : null;
  }

  // Get all parking locations with pagination and filters
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      status 
    } = options;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let sql = 'SELECT * FROM parking_locations WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const rows = await allQuery(sql, params);
    return rows.map(row => new ParkingLocation(row));
  }

  // Update parking location
  async update(updateData) {
    const allowedFields = [
      'name', 'address', 'lat', 'lng', 'totalSpaces', 'availableSpaces',
      'hourlyRate', 'dailyRate', 'monthlyRate', 'features', 'status',
      'openingHoursMonday', 'openingHoursTuesday', 'openingHoursWednesday',
      'openingHoursThursday', 'openingHoursFriday', 'openingHoursSaturday',
      'openingHoursSunday', 'contactPhone', 'contactEmail', 'managerName',
      'managerPhone', 'managerEmail'
    ];

    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'features' && Array.isArray(value)) {
          updates.push('features = ?');
          params.push(JSON.stringify(value));
        } else if (key === 'totalSpaces') {
          updates.push('total_spaces = ?');
          params.push(value);
        } else if (key === 'availableSpaces') {
          updates.push('available_spaces = ?');
          params.push(value);
        } else if (key === 'hourlyRate') {
          updates.push('hourly_rate = ?');
          params.push(value);
        } else if (key === 'dailyRate') {
          updates.push('daily_rate = ?');
          params.push(value);
        } else if (key === 'monthlyRate') {
          updates.push('monthly_rate = ?');
          params.push(value);
        } else if (key === 'openingHoursMonday') {
          updates.push('opening_hours_monday = ?');
          params.push(value);
        } else if (key === 'openingHoursTuesday') {
          updates.push('opening_hours_tuesday = ?');
          params.push(value);
        } else if (key === 'openingHoursWednesday') {
          updates.push('opening_hours_wednesday = ?');
          params.push(value);
        } else if (key === 'openingHoursThursday') {
          updates.push('opening_hours_thursday = ?');
          params.push(value);
        } else if (key === 'openingHoursFriday') {
          updates.push('opening_hours_friday = ?');
          params.push(value);
        } else if (key === 'openingHoursSaturday') {
          updates.push('opening_hours_saturday = ?');
          params.push(value);
        } else if (key === 'openingHoursSunday') {
          updates.push('opening_hours_sunday = ?');
          params.push(value);
        } else if (key === 'contactPhone') {
          updates.push('contact_phone = ?');
          params.push(value);
        } else if (key === 'contactEmail') {
          updates.push('contact_email = ?');
          params.push(value);
        } else if (key === 'managerName') {
          updates.push('manager_name = ?');
          params.push(value);
        } else if (key === 'managerPhone') {
          updates.push('manager_phone = ?');
          params.push(value);
        } else if (key === 'managerEmail') {
          updates.push('manager_email = ?');
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
    const sql = `UPDATE parking_locations SET ${updates.join(', ')} WHERE id = ?`;

    await runQuery(sql, params);

    // Update local instance
    Object.assign(this, updateData);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Update available spaces
  async updateAvailableSpaces(availableSpaces) {
    if (availableSpaces < 0 || availableSpaces > this.totalSpaces) {
      throw new Error('Available spaces must be between 0 and total spaces');
    }
    return await this.update({ availableSpaces });
  }

  // Update status
  async updateStatus(status) {
    return await this.update({ status });
  }

  // Delete parking location
  async delete() {
    await runQuery('DELETE FROM parking_locations WHERE id = ?', [this.id]);
    return true;
  }

  // Get parking location statistics
  static async getStats() {
    const statusStats = await allQuery('SELECT status, COUNT(*) as count FROM parking_locations GROUP BY status');
    const totalResult = await getQuery('SELECT COUNT(*) as total FROM parking_locations');
    const totalSpacesResult = await getQuery('SELECT SUM(total_spaces) as total_spaces FROM parking_locations');
    const availableSpacesResult = await getQuery('SELECT SUM(available_spaces) as available_spaces FROM parking_locations');

    return {
      total: totalResult.total,
      totalSpaces: totalSpacesResult.total_spaces || 0,
      availableSpaces: availableSpacesResult.available_spaces || 0,
      statusStats
    };
  }

  // Convert to JSON
  toJSON() {
    const locationData = { ...this };
    if (locationData.features) {
      try {
        locationData.features = JSON.parse(locationData.features);
      } catch (e) {
        locationData.features = [];
      }
    } else {
      locationData.features = [];
    }

    return {
      id: locationData.id,
      name: locationData.name,
      address: locationData.address,
      coordinates: {
        lat: locationData.lat,
        lng: locationData.lng
      },
      totalSpaces: locationData.totalSpaces,
      availableSpaces: locationData.availableSpaces,
      hourlyRate: locationData.hourlyRate,
      dailyRate: locationData.dailyRate,
      monthlyRate: locationData.monthlyRate,
      features: locationData.features,
      status: locationData.status,
      openingHours: {
        monday: locationData.openingHoursMonday,
        tuesday: locationData.openingHoursTuesday,
        wednesday: locationData.openingHoursWednesday,
        thursday: locationData.openingHoursThursday,
        friday: locationData.openingHoursFriday,
        saturday: locationData.openingHoursSaturday,
        sunday: locationData.openingHoursSunday
      },
      contact: {
        phone: locationData.contactPhone,
        email: locationData.contactEmail
      },
      manager: {
        name: locationData.managerName,
        phone: locationData.managerPhone,
        email: locationData.managerEmail
      },
      createdAt: locationData.createdAt,
      updatedAt: locationData.updatedAt
    };
  }
}

module.exports = ParkingLocation;
