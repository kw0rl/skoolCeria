const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'skoolceria',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function checkDatabase() {
    try {
        console.log('🔌 Menyambung ke database...');

        // Get list of tables
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);

        if (res.rows.length === 0) {
            console.log('⚠️  Tiada table dijumpai.');
        } else {
            console.log('\n📊 Senarai Table & Jumlah Rekod:');
            console.log('=================================');

            for (const row of res.rows) {
                const tableName = row.table_name;
                const countRes = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
                const count = countRes.rows[0].count;

                console.log(`📁 ${tableName.padEnd(25)} : ${count} rekod`);
            }
            console.log('=================================');
        }

        console.log('\n✅ Selesai.');
    } catch (err) {
        console.error('❌ Ralat:', err.message);
    } finally {
        await pool.end();
    }
}

checkDatabase();
