// swagger doc
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const reqComponents = Object.assign(
  {}, 
  require("./req/ReqUser"), 
  require("./req/ReqClass")
)

const resComponents = Object.assign(
  {},
  require("./res/ResError"),
  require("./res/ResUser"),
  require("./res/ResClass"),
)

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: { // API informations (required)
    title: 'Capstone Helper', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Capstone Helper API list' // Description (optional)
  },
  basePath: '/', // Base path (optional)
  components: {
    req: reqComponents,
    res: resComponents
  }
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: [
    './api/user/user.controller.js', 
    "./api/class/class.controller.js",
    "./api/team/team.controller.js",
    "./api/message/message.controller.js",
    "./api/lecture/lecture.controller.js",
    "./api/presentation/presentation.controller.js",
  ]
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

module.exports = [
    swaggerUi.serve, swaggerUi.setup(swaggerSpec)
]