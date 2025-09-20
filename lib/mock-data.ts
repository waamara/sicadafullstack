import { Ticket, User, DashboardStats, Activity, PortalConfig, ParkingRequest, ParkingLocation } from './types'

export const mockTickets: Ticket[] = [
  // Business Portal Tickets
  {
    id: '1',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    user: {
      name: 'Aymen Berbiche',
      email: 'aymen.berbiche@company.com',
      phone: '0666786789',
      idCard: '112234567',
      department: 'Informatique',
      position: 'Manager'
    },
    description: 'Request for parking space assignment',
    portal: 'business'
  },
  {
    id: '2',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'pending',
    priority: 'low',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '0554568635',
      idCard: '13434155475689',
      department: 'Marketing',
      position: 'Supervisor'
    },
    description: 'Need parking space for new employee',
    portal: 'business'
  },
  {
    id: '3',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'approved',
    priority: 'high',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
    user: {
      name: 'Mohamed Ali',
      email: 'mohamed.ali@company.com',
      phone: '0771234567',
      idCard: '12251143677789',
      department: 'Finance',
      position: 'Analyst'
    },
    description: 'Urgent parking request for client meeting',
    portal: 'business'
  },
  {
    id: '4',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'rejected',
    priority: 'low',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T15:30:00Z',
    user: {
      name: 'Fatima Zahra',
      email: 'fatima.zahra@company.com',
      phone: '0667890123',
      idCard: '14567890123456',
      department: 'HR',
      position: 'Coordinator'
    },
    description: 'Parking space request - no available spots',
    portal: 'business'
  },
  {
    id: '5',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-11T13:45:00Z',
    updatedAt: '2024-01-11T13:45:00Z',
    user: {
      name: 'Ahmed Benali',
      email: 'ahmed.benali@company.com',
      phone: '0555678901',
      idCard: '15678901234567',
      department: 'Operations',
      position: 'Manager'
    },
    description: 'Request for permanent parking assignment',
    portal: 'business'
  },

  // Police Portal Tickets - Citizen Complaints
  {
    id: '6',
    title: 'Voiture garée devant ma porte',
    type: 'complaint',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    user: {
      name: 'Karim Benali',
      email: 'karim.benali@gmail.com',
      phone: '0661234567',
      idCard: '12345678901234',
      address: '123 Rue de la Paix, Alger'
    },
    description: 'Une voiture est garée devant ma porte depuis 3 jours, je ne peux plus sortir de chez moi. La plaque d\'immatriculation est 12345-A-16.',
    images: ['/placeholder.svg'],
    location: {
      address: '123 Rue de la Paix, Alger',
      coordinates: { lat: 36.7538, lng: 3.0588 }
    },
    portal: 'police'
  },
  {
    id: '7',
    title: 'Stationnement illégal sur trottoir',
    type: 'complaint',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    user: {
      name: 'Aicha Mansouri',
      email: 'aicha.mansouri@yahoo.com',
      phone: '0556789012',
      idCard: '23456789012345',
      address: '456 Avenue des Martyrs, Alger'
    },
    description: 'Plusieurs voitures stationnent sur le trottoir devant l\'école, les enfants ne peuvent plus passer. Situation dangereuse.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: {
      address: '456 Avenue des Martyrs, Alger',
      coordinates: { lat: 36.7638, lng: 3.0688 }
    },
    assignedOfficer: 'Officer Ahmed',
    portal: 'police'
  },

  // Police Portal Tickets - Parking Violations
  {
    id: '8',
    title: 'Violation de stationnement - Zone interdite',
    type: 'violation',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    user: {
      name: 'Officer Youssef',
      email: 'youssef.police@police.dz',
      phone: '0667890123',
      idCard: 'POL001234',
      address: 'Commissariat Central, Alger'
    },
    description: 'Voiture stationnée dans une zone de stationnement interdite près de l\'hôpital. Plaque: 98765-B-16',
    images: ['/placeholder.svg'],
    location: {
      address: 'Zone interdite - Hôpital Mustapha, Alger',
      coordinates: { lat: 36.7738, lng: 3.0788 }
    },
    portal: 'police'
  },
  {
    id: '9',
    title: 'Stationnement sur passage piéton',
    type: 'violation',
    status: 'resolved',
    priority: 'urgent',
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T18:30:00Z',
    user: {
      name: 'Officer Fatima',
      email: 'fatima.police@police.dz',
      phone: '0551234567',
      idCard: 'POL002345',
      address: 'Commissariat Central, Alger'
    },
    description: 'Voiture bloquant complètement le passage piéton. Situation très dangereuse pour les piétons.',
    images: ['/placeholder.svg'],
    location: {
      address: 'Passage piéton - Boulevard Mohamed V, Alger',
      coordinates: { lat: 36.7838, lng: 3.0888 }
    },
    assignedOfficer: 'Officer Fatima',
    resolution: 'Véhicule remorqué. Amende de 5000 DA appliquée.',
    portal: 'police'
  }
]

export const mockUsers: User[] = [
  // Business Portal Users
  {
    id: '1',
    fullName: 'Aymen Berbiche',
    email: 'aymen.berbiche@company.com',
    phone: '0666786789',
    idCard: '112234567',
    department: 'Informatique',
    position: 'Manager',
    status: 'active',
    role: 'employee',
    portal: 'business',
    createdAt: '2023-06-15T08:00:00Z',
    lastLogin: '2024-01-15T09:30:00Z'
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '0554568635',
    idCard: '13434155475689',
    department: 'Marketing',
    position: 'Supervisor',
    status: 'active',
    role: 'employee',
    portal: 'business',
    createdAt: '2023-08-20T10:15:00Z',
    lastLogin: '2024-01-14T16:20:00Z'
  },
  {
    id: '3',
    fullName: 'Mohamed Ali',
    email: 'mohamed.ali@company.com',
    phone: '0771234567',
    idCard: '12251143677789',
    department: 'Finance',
    position: 'Analyst',
    status: 'active',
    role: 'employee',
    portal: 'business',
    createdAt: '2023-09-10T14:30:00Z',
    lastLogin: '2024-01-15T08:45:00Z'
  },
  {
    id: '4',
    fullName: 'Fatima Zahra',
    email: 'fatima.zahra@company.com',
    phone: '0667890123',
    idCard: '14567890123456',
    department: 'HR',
    position: 'Coordinator',
    status: 'active',
    role: 'employee',
    portal: 'business',
    createdAt: '2023-07-05T11:20:00Z',
    lastLogin: '2024-01-13T12:10:00Z'
  },
  {
    id: '5',
    fullName: 'Ahmed Benali',
    email: 'ahmed.benali@company.com',
    phone: '0555678901',
    idCard: '15678901234567',
    department: 'Operations',
    position: 'Manager',
    status: 'active',
    role: 'employee',
    portal: 'business',
    createdAt: '2023-05-12T09:45:00Z',
    lastLogin: '2024-01-15T07:30:00Z'
  },
  {
    id: '6',
    fullName: 'Layla Mansouri',
    email: 'layla.mansouri@company.com',
    phone: '0662345678',
    idCard: '16789012345678',
    department: 'Sales',
    position: 'Representative',
    status: 'inactive',
    role: 'employee',
    portal: 'business',
    createdAt: '2023-10-15T13:00:00Z',
    lastLogin: '2024-01-10T17:45:00Z'
  },

  // Police Portal Users
  {
    id: '7',
    fullName: 'Officer Ahmed Benali',
    email: 'ahmed.police@police.dz',
    phone: '0661234567',
    idCard: 'POL001234',
    status: 'active',
    role: 'police_officer',
    portal: 'police',
    badgeNumber: 'POL-001',
    rank: 'Lieutenant',
    station: 'Commissariat Central, Alger',
    createdAt: '2023-03-15T08:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z'
  },
  {
    id: '8',
    fullName: 'Officer Fatima Mansouri',
    email: 'fatima.police@police.dz',
    phone: '0551234567',
    idCard: 'POL002345',
    status: 'active',
    role: 'police_officer',
    portal: 'police',
    badgeNumber: 'POL-002',
    rank: 'Sergent',
    station: 'Commissariat Central, Alger',
    createdAt: '2023-04-20T10:15:00Z',
    lastLogin: '2024-01-15T09:15:00Z'
  },
  {
    id: '9',
    fullName: 'Officer Youssef Khelil',
    email: 'youssef.police@police.dz',
    phone: '0667890123',
    idCard: 'POL003456',
    status: 'active',
    role: 'police_officer',
    portal: 'police',
    badgeNumber: 'POL-003',
    rank: 'Capitaine',
    station: 'Commissariat Central, Alger',
    createdAt: '2023-02-10T14:30:00Z',
    lastLogin: '2024-01-15T11:00:00Z'
  },

  // Wilaya Portal Users
  {
    id: '10',
    fullName: 'Admin Mustapha',
    email: 'admin.mustapha@wilaya.dz',
    phone: '0661111111',
    idCard: 'ADM001234',
    status: 'active',
    role: 'admin',
    portal: 'wilaya',
    createdAt: '2023-01-01T08:00:00Z',
    lastLogin: '2024-01-15T12:00:00Z'
  }
]

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'ticket_created',
    description: 'New parking request from Aymen Berbiche',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Aymen Berbiche',
    portal: 'business'
  },
  {
    id: '2',
    type: 'ticket_approved',
    description: 'Parking request approved for Mohamed Ali',
    timestamp: '2024-01-13T16:45:00Z',
    user: 'Mohamed Ali',
    portal: 'business'
  },
  {
    id: '3',
    type: 'user_registered',
    description: 'New user registered: Ahmed Benali',
    timestamp: '2024-01-11T13:45:00Z',
    user: 'Ahmed Benali',
    portal: 'business'
  },
  {
    id: '4',
    type: 'ticket_rejected',
    description: 'Parking request rejected for Fatima Zahra',
    timestamp: '2024-01-12T15:30:00Z',
    user: 'Fatima Zahra',
    portal: 'business'
  },
  {
    id: '5',
    type: 'ticket_created',
    description: 'New parking request from Sarah Johnson',
    timestamp: '2024-01-14T14:20:00Z',
    user: 'Sarah Johnson',
    portal: 'business'
  },
  {
    id: '6',
    type: 'complaint_received',
    description: 'New complaint from citizen: Voiture garée devant ma porte',
    timestamp: '2024-01-15T08:30:00Z',
    user: 'Karim Benali',
    portal: 'police'
  },
  {
    id: '7',
    type: 'violation_reported',
    description: 'Parking violation reported by Officer Youssef',
    timestamp: '2024-01-15T10:00:00Z',
    user: 'Officer Youssef',
    portal: 'police'
  },
  {
    id: '8',
    type: 'ticket_resolved',
    description: 'Parking violation resolved by Officer Fatima',
    timestamp: '2024-01-13T18:30:00Z',
    user: 'Officer Fatima',
    portal: 'police'
  }
]

export const mockParkingRequests: ParkingRequest[] = [
  {
    id: '1',
    title: 'Demande d\'ouverture d\'un nouveau parking - Centre Commercial',
    description: 'Nous demandons l\'autorisation d\'ouvrir un nouveau parking de 200 places près du centre commercial d\'Alger. Ce parking servira à désengorger la circulation dans cette zone très fréquentée.',
    location: {
      address: 'Avenue des Martyrs, Alger Centre',
      coordinates: { lat: 36.7538, lng: 3.0588 }
    },
    requester: {
      name: 'Ahmed Benali',
      email: 'ahmed.benali@cc-alger.dz',
      phone: '0661234567',
      idCard: '12345678901234',
      organization: 'Centre Commercial d\'Alger'
    },
    status: 'pending',
    priority: 'high',
    requestedSpaces: 200,
    estimatedCost: 5000000,
    documents: ['/placeholder.svg', '/placeholder.svg'],
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z'
  },
  {
    id: '2',
    title: 'Parking résidentiel - Quartier Hydra',
    description: 'Demande pour créer un parking souterrain de 50 places pour les résidents du quartier Hydra. Le projet inclut un système de sécurité et d\'éclairage LED.',
    location: {
      address: 'Rue des Pins, Hydra, Alger',
      coordinates: { lat: 36.7438, lng: 3.0488 }
    },
    requester: {
      name: 'Fatima Zohra',
      email: 'f.zohra@hydra-residents.dz',
      phone: '0556789012',
      idCard: '23456789012345',
      organization: 'Association des Résidents Hydra'
    },
    status: 'in_review',
    priority: 'medium',
    requestedSpaces: 50,
    estimatedCost: 1500000,
    documents: ['/placeholder.svg'],
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    reviewedBy: 'Admin Wilaya',
    reviewNotes: 'En cours d\'évaluation technique'
  },
  {
    id: '3',
    title: 'Parking commercial - Zone industrielle',
    description: 'Création d\'un parking de 100 places pour les employés de la zone industrielle de Rouiba. Accès 24h/24 avec système de badge.',
    location: {
      address: 'Zone Industrielle, Rouiba',
      coordinates: { lat: 36.7338, lng: 3.0388 }
    },
    requester: {
      name: 'Mohamed Khelil',
      email: 'm.khelil@rouiba-industries.dz',
      phone: '0667890123',
      idCard: '34567890123456',
      organization: 'Association des Industries de Rouiba'
    },
    status: 'approved',
    priority: 'high',
    requestedSpaces: 100,
    estimatedCost: 2500000,
    documents: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
    reviewedBy: 'Admin Wilaya',
    reviewNotes: 'Approuvé - Début des travaux prévu pour février 2024'
  }
]

export const mockParkingLocations: ParkingLocation[] = [
  {
    id: '1',
    name: 'Parking Central Alger',
    address: 'Place des Martyrs, Alger Centre',
    coordinates: { lat: 36.7538, lng: 3.0588 },
    totalSpaces: 500,
    availableSpaces: 320,
    hourlyRate: 50,
    dailyRate: 300,
    monthlyRate: 5000,
    features: ['Surveillance 24h', 'Éclairage LED', 'Accès handicapés', 'Recharge électrique'],
    status: 'active',
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 20:00',
      sunday: '08:00 - 20:00'
    },
    contact: {
      phone: '021 23 45 67',
      email: 'parking.central@wilaya-alger.dz'
    },
    manager: {
      name: 'Karim Benali',
      phone: '0661234567',
      email: 'k.benali@wilaya-alger.dz'
    },
    createdAt: '2023-06-15T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Parking Université Alger',
    address: 'Campus Universitaire, Ben Aknoun',
    coordinates: { lat: 36.7438, lng: 3.0488 },
    totalSpaces: 300,
    availableSpaces: 150,
    hourlyRate: 30,
    dailyRate: 200,
    monthlyRate: 3000,
    features: ['Tarif étudiant', 'Surveillance', 'Éclairage', 'Accès handicapés'],
    status: 'active',
    openingHours: {
      monday: '07:00 - 19:00',
      tuesday: '07:00 - 19:00',
      wednesday: '07:00 - 19:00',
      thursday: '07:00 - 19:00',
      friday: '07:00 - 19:00',
      saturday: '08:00 - 17:00',
      sunday: 'Fermé'
    },
    contact: {
      phone: '021 45 67 89',
      email: 'parking.universite@wilaya-alger.dz'
    },
    manager: {
      name: 'Aicha Benali',
      phone: '0556789012',
      email: 'a.benali@wilaya-alger.dz'
    },
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    name: 'Parking Marché Central',
    address: 'Rue Didouche Mourad, Alger',
    coordinates: { lat: 36.7638, lng: 3.0688 },
    totalSpaces: 200,
    availableSpaces: 0,
    hourlyRate: 40,
    dailyRate: 250,
    monthlyRate: 4000,
    features: ['Surveillance', 'Éclairage', 'Accès handicapés'],
    status: 'full',
    openingHours: {
      monday: '06:00 - 21:00',
      tuesday: '06:00 - 21:00',
      wednesday: '06:00 - 21:00',
      thursday: '06:00 - 21:00',
      friday: '06:00 - 21:00',
      saturday: '06:00 - 21:00',
      sunday: '08:00 - 20:00'
    },
    contact: {
      phone: '021 34 56 78',
      email: 'parking.marche@wilaya-alger.dz'
    },
    manager: {
      name: 'Omar Khelil',
      phone: '0667890123',
      email: 'o.khelil@wilaya-alger.dz'
    },
    createdAt: '2023-03-10T08:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  },
  {
    id: '4',
    name: 'Parking Aéroport Houari Boumediene',
    address: 'Aéroport Houari Boumediene, Dar El Beida',
    coordinates: { lat: 36.6938, lng: 3.2188 },
    totalSpaces: 1000,
    availableSpaces: 750,
    hourlyRate: 100,
    dailyRate: 500,
    monthlyRate: 8000,
    features: ['Surveillance 24h', 'Éclairage LED', 'Accès handicapés', 'Recharge électrique', 'Navette gratuite'],
    status: 'active',
    openingHours: {
      monday: '24h/24',
      tuesday: '24h/24',
      wednesday: '24h/24',
      thursday: '24h/24',
      friday: '24h/24',
      saturday: '24h/24',
      sunday: '24h/24'
    },
    contact: {
      phone: '021 56 78 90',
      email: 'parking.aeroport@wilaya-alger.dz'
    },
    manager: {
      name: 'Nadia Benali',
      phone: '0778901234',
      email: 'n.benali@wilaya-alger.dz'
    },
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T11:45:00Z'
  }
]

export const portalConfigs: PortalConfig[] = [
  {
    id: 'business',
    name: 'Business Portal',
    description: 'Employee management and internal requests',
    icon: 'Building2',
    color: 'blue',
    allowedRoles: ['employee', 'admin'],
    ticketTypes: ['parking', 'equipment', 'access', 'other']
  },
  {
    id: 'police',
    name: 'Police Portal',
    description: 'Citizen complaints and parking violations',
    icon: 'Shield',
    color: 'red',
    allowedRoles: ['police_officer', 'admin'],
    ticketTypes: ['complaint', 'violation']
  },
  {
    id: 'wilaya',
    name: 'Wilaya Portal',
    description: 'Parking management and administrative oversight',
    icon: 'Landmark',
    color: 'green',
    allowedRoles: ['admin'],
    ticketTypes: ['parking_request', 'parking_management']
  }
]

export const mockDashboardStats: DashboardStats = {
  totalUsers: mockUsers.length,
  activeUsers: mockUsers.filter(user => user.status === 'active').length,
  pendingTickets: mockTickets.filter(ticket => ticket.status === 'pending').length,
  resolvedTickets: mockTickets.filter(ticket => ticket.status === 'approved' || ticket.status === 'rejected').length,
  totalTickets: mockTickets.length,
  recentActivity: mockActivities.slice(0, 5)
}
