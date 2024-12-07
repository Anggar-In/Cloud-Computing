const express = require('express');
const bodyParser = require("body-parser");
const logRequest = require('./src/log');
const app = express();
const routes = require('./src/routes');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');


const swaggerDocument = yaml.load(fs.readFileSync('./api_test/swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json()); 
app.use(routes); 
app.use(bodyParser.json());
app.use(logRequest);
app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
