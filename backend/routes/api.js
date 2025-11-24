const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all teachers
router.get('/teachers', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM teachers ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all classes
router.get('/classes', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM classes ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit Cleanliness Report
router.post('/reports/cleanliness', async (req, res) => {
    const { week, date, session, teacher_id, class_id, score_kebersihan, score_keceriaan, score_papan_kenyataan, score_markah_tambahan, total_score } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO reports_cleanliness 
      (week, date, session, teacher_id, class_id, score_kebersihan, score_keceriaan, score_papan_kenyataan, score_markah_tambahan, total_score) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [week, date, session, teacher_id, class_id, score_kebersihan, score_keceriaan, score_papan_kenyataan, score_markah_tambahan, total_score]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit Duty Report
router.post('/reports/duty', async (req, res) => {
    const {
        week, date, session, teacher_id, activities, issues,
        cleanliness_toilet_teacher_m, cleanliness_toilet_teacher_f,
        cleanliness_toilet_student_m, cleanliness_toilet_student_f,
        cleanliness_surau, cleanliness_school_area, cleanliness_canteen,
        discipline_status, prepared_by
    } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO reports_duty 
      (week, date, session, teacher_id, activities, issues, 
       cleanliness_toilet_teacher_m, cleanliness_toilet_teacher_f,
       cleanliness_toilet_student_m, cleanliness_toilet_student_f,
       cleanliness_surau, cleanliness_school_area, cleanliness_canteen,
       discipline_status, prepared_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            [
                week, date, session, teacher_id, activities, issues,
                cleanliness_toilet_teacher_m, cleanliness_toilet_teacher_f,
                cleanliness_toilet_student_m, cleanliness_toilet_student_f,
                cleanliness_surau, cleanliness_school_area, cleanliness_canteen,
                discipline_status, prepared_by
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Cleanliness Reports History
router.get('/reports/cleanliness', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT r.*, t.name as teacher_name, c.name as class_name 
      FROM reports_cleanliness r
      JOIN teachers t ON r.teacher_id = t.id
      JOIN classes c ON r.class_id = c.id
      ORDER BY r.created_at DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Duty Reports History
router.get('/reports/duty', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT r.*, t.name as teacher_name
      FROM reports_duty r
      JOIN teachers t ON r.teacher_id = t.id
      ORDER BY r.created_at DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Analytics (Top 5 Classes)
router.get('/analytics', async (req, res) => {
    const { session } = req.query;
    try {
        let query = `
      SELECT c.name, SUM(r.total_score) as total_score
      FROM reports_cleanliness r
      JOIN classes c ON r.class_id = c.id
    `;

        const params = [];
        if (session) {
            query += ` WHERE r.session = $1`;
            params.push(session);
        }

        query += `
      GROUP BY c.name
      ORDER BY total_score DESC
      LIMIT 5
    `;

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
