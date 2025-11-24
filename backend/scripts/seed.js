const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../db');

const schemaPath = path.join(__dirname, '../../database/schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

async function seed() {
    try {
        console.log('Running schema...');
        await db.query(schemaSql);
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seed();
