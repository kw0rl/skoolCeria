const db = require('../db');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function updateSchema() {
    try {
        console.log('Updating schema...');

        // Add new columns to reports_duty table
        await db.query(`
            ALTER TABLE reports_duty 
            ADD COLUMN IF NOT EXISTS cleanliness_toilet_teacher_m VARCHAR(50),
            ADD COLUMN IF NOT EXISTS cleanliness_toilet_teacher_f VARCHAR(50),
            ADD COLUMN IF NOT EXISTS cleanliness_toilet_student_m VARCHAR(50),
            ADD COLUMN IF NOT EXISTS cleanliness_toilet_student_f VARCHAR(50),
            ADD COLUMN IF NOT EXISTS cleanliness_surau VARCHAR(50),
            ADD COLUMN IF NOT EXISTS cleanliness_school_area VARCHAR(50),
            ADD COLUMN IF NOT EXISTS cleanliness_canteen VARCHAR(50),
            ADD COLUMN IF NOT EXISTS discipline_status VARCHAR(50),
            ADD COLUMN IF NOT EXISTS prepared_by INTEGER REFERENCES teachers(id);
        `);

        console.log('Schema updated successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error updating schema:', err);
        process.exit(1);
    }
}

updateSchema();
