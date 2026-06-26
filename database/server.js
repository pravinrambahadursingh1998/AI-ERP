const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const db = require('./config/db')
// const routes = require('./routes/route')
const path = require('path');
// const cors = require('cors')
require("dotenv").config();

const app = express();
const port = 8080;
const angularDistPath = path.join(__dirname, '../client/dist/ai-erp/browser');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cors());

// Cors Config
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    next()
})

// API routes
// app.use('/api', routes);

// Serve Angular app from the same port
app.use(express.static(angularDistPath));

// Angular SPA fallback (client-side routes like /login, /signup)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
