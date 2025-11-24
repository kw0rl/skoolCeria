const db = require('../db');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    try {
        console.log('🔍 Checking database setup...');

        // Check if tables exist
        const checkQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'teachers'
            );
        `;

        const result = await db.query(checkQuery);
        const tablesExist = result.rows[0].exists;

        if (!tablesExist) {
            console.log('📦 Tables not found. Creating database schema...');

            // Read and execute schema.sql
            // Go up two levels: scripts -> backend -> root -> database
            const schemaPath = path.join(__dirname, '../../database/schema.sql');
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');

            await db.query(schemaSql);
            console.log('✅ Database schema created successfully!');
        } else {
            console.log('✅ Database already initialized.');
        }

        // Check if we need to add new columns for duty reports
        const checkDutyColumns = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'reports_duty' 
            AND column_name = 'cleanliness_toilet_teacher_m';
        `;

        const dutyResult = await db.query(checkDutyColumns);

        if (dutyResult.rows.length === 0) {
            console.log('📦 Adding new columns to reports_duty...');

            const alterQuery = `
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
            `;

            await db.query(alterQuery);
            console.log('✅ New columns added successfully!');
        }

    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        // Don't throw error - let server continue even if DB setup fails
        // This allows you to debug via logs
    }
}

module.exports = initializeDatabase;
