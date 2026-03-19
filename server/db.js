const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      date DATE,
      emoji VARCHAR(10) DEFAULT '🎁',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wishes (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      url TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      reserved_by VARCHAR(100) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Database migrated');
}

module.exports = { pool, migrate };
