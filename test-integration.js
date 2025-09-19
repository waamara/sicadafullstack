#!/usr/bin/env node

const https = require('http');

const API_BASE = 'http://localhost:3001/api';
const FRONTEND_BASE = 'http://localhost:3000';

// Test colors
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testBackendHealth() {
  log('\n🔍 Testing Backend Health...', 'blue');
  try {
    const response = await makeRequest(`${API_BASE.replace('/api', '')}/health`);
    if (response.status === 200 && response.data.success) {
      log('✅ Backend is running and healthy', 'green');
      return true;
    } else {
      log('❌ Backend health check failed', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Backend is not responding', 'red');
    return false;
  }
}

async function testAuthentication() {
  log('\n🔐 Testing Authentication...', 'blue');
  
  const testAccounts = [
    { email: 'admin@sicada.dz', password: 'admin123', role: 'admin', name: 'Admin' },
    { email: 'aymen.berbiche@company.com', password: 'password123', role: 'employee', name: 'Business User' },
    { email: 'ahmed.police@police.dz', password: 'police123', role: 'police_officer', name: 'Police Officer' }
  ];

  let tokens = {};
  
  for (const account of testAccounts) {
    try {
      const response = await makeRequest(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: account
      });
      
      if (response.status === 200 && response.data.success) {
        tokens[account.role] = response.data.data.token;
        log(`✅ ${account.name} login successful`, 'green');
      } else {
        log(`❌ ${account.name} login failed: ${response.data.message}`, 'red');
        return false;
      }
    } catch (error) {
      log(`❌ ${account.name} login error: ${error.message}`, 'red');
      return false;
    }
  }
  
  return tokens;
}

async function testAPIEndpoints(tokens) {
  log('\n📡 Testing API Endpoints...', 'blue');
  
  const endpoints = [
    { name: 'Dashboard Stats', url: '/dashboard/stats', token: tokens.admin },
    { name: 'Users List', url: '/users', token: tokens.admin },
    { name: 'Tickets List', url: '/tickets', token: tokens.employee },
    { name: 'Parking Requests', url: '/parking-requests', token: tokens.admin },
    { name: 'Parking Locations', url: '/parking-locations', token: tokens.admin }
  ];

  let successCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${API_BASE}${endpoint.url}`, {
        headers: { Authorization: `Bearer ${endpoint.token}` }
      });
      
      if (response.status === 200 && response.data.success) {
        log(`✅ ${endpoint.name} - OK`, 'green');
        successCount++;
      } else {
        log(`❌ ${endpoint.name} - Failed: ${response.data.message}`, 'red');
      }
    } catch (error) {
      log(`❌ ${endpoint.name} - Error: ${error.message}`, 'red');
    }
  }
  
  return successCount === endpoints.length;
}

async function testFrontend() {
  log('\n🌐 Testing Frontend...', 'blue');
  try {
    const response = await makeRequest(FRONTEND_BASE);
    if (response.status === 200 && (response.data.includes('Sicada') || response.data.includes('Portal'))) {
      log('✅ Frontend is running and accessible', 'green');
      return true;
    } else {
      log('❌ Frontend is not responding correctly', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Frontend is not responding', 'red');
    return false;
  }
}

async function runTests() {
  log('🚀 Starting Integration Tests...', 'bold');
  log('=' * 50, 'blue');
  
  const results = {
    backend: await testBackendHealth(),
    frontend: await testFrontend()
  };
  
  if (!results.backend) {
    log('\n❌ Backend tests failed. Please start the backend server first.', 'red');
    log('Run: cd backend && node server.js', 'yellow');
    return;
  }
  
  if (!results.frontend) {
    log('\n❌ Frontend tests failed. Please start the frontend server first.', 'red');
    log('Run: npm run dev', 'yellow');
    return;
  }
  
  const tokens = await testAuthentication();
  if (!tokens) {
    log('\n❌ Authentication tests failed.', 'red');
    return;
  }
  
  const apiSuccess = await testAPIEndpoints(tokens);
  
  log('\n' + '=' * 50, 'blue');
  log('📊 Test Results Summary:', 'bold');
  log(`Backend Health: ${results.backend ? '✅ PASS' : '❌ FAIL'}`, results.backend ? 'green' : 'red');
  log(`Frontend Access: ${results.frontend ? '✅ PASS' : '❌ FAIL'}`, results.frontend ? 'green' : 'red');
  log(`Authentication: ${tokens ? '✅ PASS' : '❌ FAIL'}`, tokens ? 'green' : 'red');
  log(`API Endpoints: ${apiSuccess ? '✅ PASS' : '❌ FAIL'}`, apiSuccess ? 'green' : 'red');
  
  if (results.backend && results.frontend && tokens && apiSuccess) {
    log('\n🎉 All tests passed! Integration is working perfectly!', 'green');
    log('\n🔑 Demo Accounts:', 'blue');
    log('👑 Admin: admin@sicada.dz / admin123', 'yellow');
    log('🏢 Business: aymen.berbiche@company.com / password123', 'yellow');
    log('👮 Police: ahmed.police@police.dz / police123', 'yellow');
    log('\n🌐 Access your app at: http://localhost:3000', 'blue');
  } else {
    log('\n❌ Some tests failed. Please check the errors above.', 'red');
  }
}

// Run the tests
runTests().catch(console.error);
