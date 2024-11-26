<<<<<<< HEAD
const express = require('express');
const bodyParser = require("body-parser");
const logRequest = require('./src/log');
const app = express();
const routes = require('./src/routes');

app.use(express.json()); 
app.use(routes); 
=======
const express = require("express");
const bodyParser = require("body-parser");
const logRequest = require("./src/log");
const app = express();
const routes = require("./src/routes");

app.use(express.json());
app.use(routes);
>>>>>>> f186631f2b34b20dafb1ea9ceee0cc95dc1e2931
app.use(bodyParser.json());
app.use(logRequest);
app.use(routes);

<<<<<<< HEAD
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
=======
const PORT = 3306;
app.listen(PORT, () => {
  console.log(`Server running on http://anggarinIP:${PORT}`);
>>>>>>> f186631f2b34b20dafb1ea9ceee0cc95dc1e2931
});
