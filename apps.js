const express = require("express");
const bodyParser = require("body-parser");
const logRequest = require("./src/log");
const app = express();
const routes = require("./src/routes");

app.use(express.json());
app.use(routes);
app.use(bodyParser.json());
app.use(logRequest);
app.use(routes);

const PORT = 3306;
app.listen(PORT, () => {
  console.log(`Server running on http://anggarinIP:${PORT}`);
});
