import { db } from './index';

async function setupDatabase() {
  try {
    // Only add sample data if the database is empty
    if ((await db.suppliers.count()) === 0) {
      // Add sample suppliers
      await db.suppliers.bulkAdd([
        { name: "John's Fishing", contact: "555-0101", licenseNumber: "LIC001" },
        { name: "Bay Clams", contact: "555-0102", licenseNumber: "LIC002" },
        { name: "Ocean Harvest", contact: "555-0103", licenseNumber: "LIC003" }
      ]);

      // Add sample product grades
      await db.productGrades.bulkAdd([
        {
          code: 'A',
          name: 'Premium',
          description: 'Highest quality, uniform size, perfect condition',
          productType: 'shell-on'
        },
        {
          code: 'B',
          name: 'Standard',
          description: 'Good quality, minor variations allowed',
          productType: 'shell-on'
        },
        {
          code: 'A',
          name: 'Premium',
          description: 'Clean, white meat, no impurities',
          productType: 'meat'
        },
        {
          code: 'B',
          name: 'Standard',
          description: 'Good quality meat, slight color variations allowed',
          productType: 'meat'
        }
      ]);

      console.log('Sample data added successfully');
    }
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Initialize database
db.isOpen() || db.open().then(setupDatabase).catch(err => {
  console.error('Failed to initialize database:', err);
  // If there's a version error, reset and try again
  if (err.name === 'VersionError') {
    db.resetDatabase()
      .then(setupDatabase)
      .catch(console.error);
  }
});