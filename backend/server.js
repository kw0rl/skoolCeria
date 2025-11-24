require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const initializeDatabase = require('./scripts/init-db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('SkoolCeria Backend Running');
});

// Initialize database then start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    // Start server anyway to allow debugging
    app.listen(PORT, () => {
        console.log(`⚠️  Server running on port ${PORT} (DB init failed)`);
    });
});
