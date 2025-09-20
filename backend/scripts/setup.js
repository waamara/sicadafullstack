#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Sicada Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envExample = fs.readFileSync(path.join(__dirname, '..', 'env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  console.log('✅ .env file created from env.example');
} else {
  console.log('✅ .env file already exists');
}

// Create necessary directories
const directories = ['database', 'uploads'];
directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Creating ${dir} directory...`);
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ ${dir} directory created`);
  } else {
    console.log(`✅ ${dir} directory already exists`);
  }
});

// Initialize database
console.log('\n🗄️  Initializing database...');
try {
  execSync('node scripts/init-db.js', { stdio: 'inherit' });
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Error initializing database:', error.message);
  process.exit(1);
}

// Seed sample data
console.log('\n🌱 Seeding sample data...');
try {
  execSync('node scripts/seed-data.js', { stdio: 'inherit' });
  console.log('✅ Sample data seeded successfully');
} catch (error) {
  console.error('❌ Error seeding data:', error.message);
  process.exit(1);
}

console.log('\n🎉 Backend setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the development server: npm run dev');
console.log('2. The API will be available at: http://localhost:3001');
console.log('3. Test the health endpoint: http://localhost:3001/health');
console.log('\n🔑 Default accounts:');
console.log('👑 Admin: admin@sicada.dz / admin123');
console.log('🏢 Business: aymen.berbiche@company.com / password123');
console.log('👮 Police: ahmed.police@police.dz / police123');
console.log('\n📚 Check the README.md for complete API documentation');


