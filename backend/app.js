const express = require('express')
const app = express()
const port = 80

const serverConfig = require("./config/config.json")

const cookieParser = require('cookie-parser');
app.use(cookieParser(serverConfig.cookieKey));
app.use(express.json())

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// middleware
var cors = require('cors');
app.use(cors()); // CORS 설정
const error = require("./middleware/error")
app.use(error.initModule)

// db
var sequelize = require('./models').sequelize;
sequelize.sync({ force: false }).then(()=>{
    console.log("Successfully connec to server")
}).catch((err)=>{
    console.log(err)
});

// router
app.use("/api", require("./api"))
app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('public'));

// open
app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    }
)