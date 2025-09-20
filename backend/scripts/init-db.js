const { db, runQuery } = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('Initializing database...');

    // Users table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        id_card TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        department TEXT,
        position TEXT,
        address TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        role TEXT NOT NULL CHECK (role IN ('employee', 'police_officer', 'admin', 'citizen')),
        portal TEXT NOT NULL CHECK (portal IN ('business', 'police', 'wilaya', 'citizen')),
        badge_number TEXT,
        rank TEXT,
        station TEXT,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    // Tickets table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('parking', 'equipment', 'access', 'complaint', 'violation', 'other')),
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'resolved')),
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        description TEXT,
        images TEXT,
        location_address TEXT,
        location_lat REAL,
        location_lng REAL,
        assigned_officer TEXT,
        resolution TEXT,
        portal TEXT NOT NULL CHECK (portal IN ('business', 'police', 'wilaya')),
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Parking requests table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS parking_requests (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        location_address TEXT NOT NULL,
        location_lat REAL,
        location_lng REAL,
        requester_name TEXT NOT NULL,
        requester_email TEXT NOT NULL,
        requester_phone TEXT NOT NULL,
        requester_id_card TEXT NOT NULL,
        requester_organization TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        requested_spaces INTEGER NOT NULL,
        estimated_cost REAL,
        documents TEXT,
        reviewed_by TEXT,
        review_notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Parking locations table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS parking_locations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        total_spaces INTEGER NOT NULL,
        available_spaces INTEGER NOT NULL,
        hourly_rate REAL NOT NULL,
        daily_rate REAL NOT NULL,
        monthly_rate REAL NOT NULL,
        features TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'full')),
        opening_hours_monday TEXT,
        opening_hours_tuesday TEXT,
        opening_hours_wednesday TEXT,
        opening_hours_thursday TEXT,
        opening_hours_friday TEXT,
        opening_hours_saturday TEXT,
        opening_hours_sunday TEXT,
        contact_phone TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        manager_name TEXT NOT NULL,
        manager_phone TEXT NOT NULL,
        manager_email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Activities table for audit log
    await runQuery(`
      CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_name TEXT,
        portal TEXT,
        ticket_id TEXT,
        user_id TEXT,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create indexes for better performance
    await runQuery('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_users_portal ON users(portal)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_tickets_type ON tickets(type)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_tickets_portal ON tickets(portal)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_parking_requests_status ON parking_requests(status)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_parking_locations_status ON parking_locations(status)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp)');

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    db.close();
  }
};

initDatabase();


