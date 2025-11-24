require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('SkoolCeria Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
