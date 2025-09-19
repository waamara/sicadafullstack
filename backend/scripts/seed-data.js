const bcrypt = require('bcryptjs');
const { runQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
  try {
    console.log('Seeding database with initial data...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminId = uuidv4();
    
    await runQuery(`
      INSERT OR REPLACE INTO users (
        id, full_name, email, phone, id_card, password_hash,
        department, position, status, role, portal, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      adminId, 'Admin System', 'admin@sicada.dz', '0660000000', 'ADM000001',
      adminPassword, 'IT', 'System Administrator', 'active', 'admin', 'wilaya'
    ]);

    // Create sample business users
    const businessUsers = [
      {
        id: uuidv4(),
        name: 'Aymen Berbiche',
        email: 'aymen.berbiche@company.com',
        phone: '0666786789',
        idCard: '112234567',
        department: 'Informatique',
        position: 'Manager'
      },
      {
        id: uuidv4(),
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        phone: '0554568635',
        idCard: '13434155475689',
        department: 'Marketing',
        position: 'Supervisor'
      },
      {
        id: uuidv4(),
        name: 'Mohamed Khelil',
        email: 'mohamed.khelil@company.com',
        phone: '0661234567',
        idCard: '123456789',
        department: 'Finance',
        position: 'Analyst'
      },
      {
        id: uuidv4(),
        name: 'Fatima Mansouri',
        email: 'fatima.mansouri@company.com',
        phone: '0559876543',
        idCard: '987654321',
        department: 'HR',
        position: 'Specialist'
      }
    ];

    for (const user of businessUsers) {
      const password = await bcrypt.hash('password123', 12);
      await runQuery(`
        INSERT OR REPLACE INTO users (
          id, full_name, email, phone, id_card, password_hash,
          department, position, status, role, portal, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        user.id, user.name, user.email, user.phone, user.idCard,
        password, user.department, user.position, 'active', 'admin', 'business'
      ]);
    }

    // Create sample police officers
    const policeUsers = [
      {
        id: uuidv4(),
        name: 'Officer Ahmed Benali',
        email: 'ahmed.police@police.dz',
        phone: '0661234567',
        idCard: 'POL001234',
        badgeNumber: 'POL-001',
        rank: 'Lieutenant',
        station: 'Commissariat Central, Alger'
      },
      {
        id: uuidv4(),
        name: 'Officer Fatima Mansouri',
        email: 'fatima.police@police.dz',
        phone: '0551234567',
        idCard: 'POL002345',
        badgeNumber: 'POL-002',
        rank: 'Sergent',
        station: 'Commissariat Central, Alger'
      },
      {
        id: uuidv4(),
        name: 'Officer Youssef Boudjedra',
        email: 'youssef.police@police.dz',
        phone: '0662345678',
        idCard: 'POL003456',
        badgeNumber: 'POL-003',
        rank: 'Captain',
        station: 'Commissariat de Police, Bab Ezzouar'
      },
      {
        id: uuidv4(),
        name: 'Officer Khadija Belkacem',
        email: 'khadija.police@police.dz',
        phone: '0558765432',
        idCard: 'POL004567',
        badgeNumber: 'POL-004',
        rank: 'Inspector',
        station: 'Commissariat de Police, Kouba'
      }
    ];

    for (const user of policeUsers) {
      const password = await bcrypt.hash('police123', 12);
      await runQuery(`
        INSERT OR REPLACE INTO users (
          id, full_name, email, phone, id_card, password_hash,
          badge_number, rank, station, status, role, portal, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        user.id, user.name, user.email, user.phone, user.idCard,
        password, user.badgeNumber, user.rank, user.station,
        'active', 'police_officer', 'police'
      ]);
    }

    // Create sample parking locations
    const parkingLocations = [
      {
        id: uuidv4(),
        name: 'Parking Central Alger',
        address: 'Place des Martyrs, Alger Centre',
        lat: 36.7538,
        lng: 3.0588,
        totalSpaces: 500,
        availableSpaces: 320,
        hourlyRate: 50,
        dailyRate: 300,
        monthlyRate: 5000,
        features: JSON.stringify(['Surveillance 24h', 'Éclairage LED', 'Accès handicapés', 'Recharge électrique']),
        status: 'active',
        openingHoursMonday: '06:00 - 22:00',
        openingHoursTuesday: '06:00 - 22:00',
        openingHoursWednesday: '06:00 - 22:00',
        openingHoursThursday: '06:00 - 22:00',
        openingHoursFriday: '06:00 - 22:00',
        openingHoursSaturday: '08:00 - 20:00',
        openingHoursSunday: '08:00 - 20:00',
        contactPhone: '021 23 45 67',
        contactEmail: 'parking.central@wilaya-alger.dz',
        managerName: 'Karim Benali',
        managerPhone: '0661234567',
        managerEmail: 'k.benali@wilaya-alger.dz'
      },
      {
        id: uuidv4(),
        name: 'Parking Université Alger',
        address: 'Campus Universitaire, Ben Aknoun',
        lat: 36.7438,
        lng: 3.0488,
        totalSpaces: 300,
        availableSpaces: 150,
        hourlyRate: 30,
        dailyRate: 200,
        monthlyRate: 3000,
        features: JSON.stringify(['Tarif étudiant', 'Surveillance', 'Éclairage', 'Accès handicapés']),
        status: 'active',
        openingHoursMonday: '07:00 - 19:00',
        openingHoursTuesday: '07:00 - 19:00',
        openingHoursWednesday: '07:00 - 19:00',
        openingHoursThursday: '07:00 - 19:00',
        openingHoursFriday: '07:00 - 19:00',
        openingHoursSaturday: '08:00 - 17:00',
        openingHoursSunday: 'Fermé',
        contactPhone: '021 45 67 89',
        contactEmail: 'parking.universite@wilaya-alger.dz',
        managerName: 'Aicha Benali',
        managerPhone: '0556789012',
        managerEmail: 'a.benali@wilaya-alger.dz'
      },
      {
        id: uuidv4(),
        name: 'Parking Hydra Centre',
        address: 'Avenue des Frères Bouadou, Hydra',
        lat: 36.7338,
        lng: 3.0388,
        totalSpaces: 200,
        availableSpaces: 45,
        hourlyRate: 40,
        dailyRate: 250,
        monthlyRate: 4000,
        features: JSON.stringify(['Surveillance 24h', 'Éclairage LED', 'Accès handicapés']),
        status: 'active',
        openingHoursMonday: '06:00 - 23:00',
        openingHoursTuesday: '06:00 - 23:00',
        openingHoursWednesday: '06:00 - 23:00',
        openingHoursThursday: '06:00 - 23:00',
        openingHoursFriday: '06:00 - 23:00',
        openingHoursSaturday: '08:00 - 22:00',
        openingHoursSunday: '08:00 - 22:00',
        contactPhone: '021 34 56 78',
        contactEmail: 'parking.hydra@wilaya-alger.dz',
        managerName: 'Youssef Boudjedra',
        managerPhone: '0662345678',
        managerEmail: 'y.boudjedra@wilaya-alger.dz'
      },
      {
        id: uuidv4(),
        name: 'Parking Bab Ezzouar',
        address: 'Route de l\'Université, Bab Ezzouar',
        lat: 36.7138,
        lng: 3.1788,
        totalSpaces: 150,
        availableSpaces: 0,
        hourlyRate: 35,
        dailyRate: 200,
        monthlyRate: 3500,
        features: JSON.stringify(['Surveillance', 'Éclairage', 'Accès handicapés']),
        status: 'full',
        openingHoursMonday: '07:00 - 20:00',
        openingHoursTuesday: '07:00 - 20:00',
        openingHoursWednesday: '07:00 - 20:00',
        openingHoursThursday: '07:00 - 20:00',
        openingHoursFriday: '07:00 - 20:00',
        openingHoursSaturday: '08:00 - 18:00',
        openingHoursSunday: '08:00 - 18:00',
        contactPhone: '021 56 78 90',
        contactEmail: 'parking.babezzouar@wilaya-alger.dz',
        managerName: 'Khadija Belkacem',
        managerPhone: '0558765432',
        managerEmail: 'k.belkacem@wilaya-alger.dz'
      }
    ];

    for (const location of parkingLocations) {
      await runQuery(`
        INSERT OR REPLACE INTO parking_locations (
          id, name, address, lat, lng, total_spaces, available_spaces,
          hourly_rate, daily_rate, monthly_rate, features, status,
          opening_hours_monday, opening_hours_tuesday, opening_hours_wednesday,
          opening_hours_thursday, opening_hours_friday, opening_hours_saturday,
          opening_hours_sunday, contact_phone, contact_email, manager_name,
          manager_phone, manager_email, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        location.id, location.name, location.address, location.lat, location.lng,
        location.totalSpaces, location.availableSpaces, location.hourlyRate,
        location.dailyRate, location.monthlyRate, location.features, location.status,
        location.openingHoursMonday, location.openingHoursTuesday, location.openingHoursWednesday,
        location.openingHoursThursday, location.openingHoursFriday, location.openingHoursSaturday,
        location.openingHoursSunday, location.contactPhone, location.contactEmail,
        location.managerName, location.managerPhone, location.managerEmail
      ]);
    }

    // Create sample parking requests
    const parkingRequests = [
      {
        id: uuidv4(),
        title: 'Demande d\'ouverture d\'un nouveau parking - Centre Commercial',
        description: 'Nous demandons l\'autorisation d\'ouvrir un nouveau parking de 200 places près du centre commercial d\'Alger.',
        locationAddress: 'Avenue des Martyrs, Alger Centre',
        locationLat: 36.7538,
        locationLng: 3.0588,
        requesterName: 'Ahmed Benali',
        requesterEmail: 'ahmed.benali@cc-alger.dz',
        requesterPhone: '0661234567',
        requesterIdCard: '12345678901234',
        requesterOrganization: 'Centre Commercial d\'Alger',
        status: 'pending',
        priority: 'high',
        requestedSpaces: 200,
        estimatedCost: 5000000,
        documents: JSON.stringify(['/placeholder.svg', '/placeholder.svg'])
      },
      {
        id: uuidv4(),
        title: 'Parking résidentiel - Quartier Hydra',
        description: 'Demande pour créer un parking souterrain de 50 places pour les résidents du quartier Hydra.',
        locationAddress: 'Rue des Pins, Hydra, Alger',
        locationLat: 36.7438,
        locationLng: 3.0488,
        requesterName: 'Fatima Zohra',
        requesterEmail: 'f.zohra@hydra-residents.dz',
        requesterPhone: '0556789012',
        requesterIdCard: '23456789012345',
        requesterOrganization: 'Association des Résidents Hydra',
        status: 'in_review',
        priority: 'medium',
        requestedSpaces: 50,
        estimatedCost: 1500000,
        documents: JSON.stringify(['/placeholder.svg'])
      },
      {
        id: uuidv4(),
        title: 'Parking pour hôpital - Bab Ezzouar',
        description: 'Demande de création d\'un parking de 100 places pour le personnel et les visiteurs de l\'hôpital.',
        locationAddress: 'Route de l\'Université, Bab Ezzouar',
        locationLat: 36.7138,
        locationLng: 3.1788,
        requesterName: 'Dr. Mohamed Khelil',
        requesterEmail: 'm.khelil@hopital-babezzouar.dz',
        requesterPhone: '0663456789',
        requesterIdCard: '34567890123456',
        requesterOrganization: 'Hôpital de Bab Ezzouar',
        status: 'approved',
        priority: 'high',
        requestedSpaces: 100,
        estimatedCost: 3000000,
        documents: JSON.stringify(['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'])
      },
      {
        id: uuidv4(),
        title: 'Parking universitaire - USTHB',
        description: 'Extension du parking existant pour accueillir 150 véhicules supplémentaires.',
        locationAddress: 'Université des Sciences et de la Technologie, Bab Ezzouar',
        locationLat: 36.7038,
        locationLng: 3.1888,
        requesterName: 'Prof. Khadija Belkacem',
        requesterEmail: 'k.belkacem@usthb.dz',
        requesterPhone: '0554567890',
        requesterIdCard: '45678901234567',
        requesterOrganization: 'USTHB',
        status: 'rejected',
        priority: 'medium',
        requestedSpaces: 150,
        estimatedCost: 4000000,
        documents: JSON.stringify(['/placeholder.svg'])
      }
    ];

    for (const request of parkingRequests) {
      await runQuery(`
        INSERT OR REPLACE INTO parking_requests (
          id, title, description, location_address, location_lat, location_lng,
          requester_name, requester_email, requester_phone, requester_id_card,
          requester_organization, status, priority, requested_spaces, estimated_cost,
          documents, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        request.id, request.title, request.description, request.locationAddress,
        request.locationLat, request.locationLng, request.requesterName,
        request.requesterEmail, request.requesterPhone, request.requesterIdCard,
        request.requesterOrganization, request.status, request.priority,
        request.requestedSpaces, request.estimatedCost, request.documents
      ]);
    }

    // Create sample tickets
    const businessUserId = businessUsers[0].id;
    const policeUserId = policeUsers[0].id;

    const tickets = [
      {
        id: uuidv4(),
        title: 'Demande de place au parking',
        type: 'parking',
        status: 'pending',
        priority: 'medium',
        description: 'Request for parking space assignment',
        portal: 'business',
        userId: businessUserId
      },
      {
        id: uuidv4(),
        title: 'Voiture garée devant ma porte',
        type: 'complaint',
        status: 'pending',
        priority: 'medium',
        description: 'Une voiture est garée devant ma porte depuis 3 jours.',
        portal: 'police',
        userId: policeUserId
      },
      {
        id: uuidv4(),
        title: 'Problème avec le système de paiement',
        type: 'equipment',
        status: 'in_progress',
        priority: 'high',
        description: 'Le terminal de paiement ne fonctionne pas correctement',
        portal: 'business',
        userId: businessUsers[1].id
      },
      {
        id: uuidv4(),
        title: 'Violation de stationnement',
        type: 'violation',
        status: 'resolved',
        priority: 'low',
        description: 'Véhicule stationné dans une zone interdite',
        portal: 'police',
        userId: policeUsers[1].id
      },
      {
        id: uuidv4(),
        title: 'Demande d\'accès au parking',
        type: 'access',
        status: 'approved',
        priority: 'medium',
        description: 'Demande d\'accès 24h/24 au parking de l\'entreprise',
        portal: 'business',
        userId: businessUsers[2].id
      },
      {
        id: uuidv4(),
        title: 'Bruit excessif la nuit',
        type: 'complaint',
        status: 'pending',
        priority: 'high',
        description: 'Bruit excessif provenant du parking la nuit',
        portal: 'police',
        userId: policeUsers[2].id
      }
    ];

    for (const ticket of tickets) {
      await runQuery(`
        INSERT OR REPLACE INTO tickets (
          id, title, type, status, priority, description, portal, user_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        ticket.id, ticket.title, ticket.type, ticket.status, ticket.priority,
        ticket.description, ticket.portal, ticket.userId
      ]);
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Default accounts created:');
    console.log('👑 Admin: admin@sicada.dz / admin123');
    console.log('🏢 Business: aymen.berbiche@company.com / password123');
    console.log('👮 Police: ahmed.police@police.dz / police123');
    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
