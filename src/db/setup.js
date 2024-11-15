import dbClient from './client.js';

async function setupDatabase() {
  try {
    // Create tables
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS fishermen (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        contact TEXT NOT NULL,
        license_number TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id TEXT PRIMARY KEY,
        fisherman_id TEXT NOT NULL,
        date TEXT NOT NULL,
        quantity REAL NOT NULL,
        price_per_kg REAL NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT CHECK(status IN ('pending', 'completed', 'cancelled')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(fisherman_id) REFERENCES fishermen(id)
      );
    `);

    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS lots (
        id TEXT PRIMARY KEY,
        purchase_order_id TEXT NOT NULL,
        creation_date TEXT NOT NULL,
        quantity REAL NOT NULL,
        status TEXT CHECK(status IN ('processing', 'completed')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(purchase_order_id) REFERENCES purchase_orders(id)
      );
    `);

    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        lot_id TEXT NOT NULL,
        type TEXT CHECK(type IN ('shell-on', 'meat')) NOT NULL,
        quantity REAL NOT NULL,
        processing_date TEXT NOT NULL,
        grade TEXT CHECK(grade IN ('A', 'B', 'C')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(lot_id) REFERENCES lots(id)
      );
    `);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await dbClient.close();
  }
}

setupDatabase();