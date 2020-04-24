// swagger doc
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: { // API informations (required)
    title: 'Capstone Helper', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Capstone Helper API list' // Description (optional)
  },
  basePath: '/' // Base path (optional)
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: ['./api/user/user.controller.js']
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

module.exports = [
    swaggerUi.serve, swaggerUi.setup(swaggerSpec)
]