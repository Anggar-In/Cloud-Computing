require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const logRequest = require('./src/log');
const routes = require('./src/routes');

const app = express();

app.use(bodyParser.json());
app.use(logRequest);
app.use(routes);

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
