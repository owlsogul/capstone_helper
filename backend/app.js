const express = require('express')
const app = express()
const port = 80

const serverConfig = require("./config/config.json")

const cookieParser = require('cookie-parser');
app.use(cookieParser(serverConfig.cookieKey));
app.use(express.json())

// application variable setting
app.set("port", 30080)
app.set("host", "http://caphelper.owlsogul.com:30080")


// middleware
const cors = require('cors');
const error = require("./middleware/error")
const apiDocs = require("./middleware/api-docs")
const settingTransmitter = require("./middleware/setting-transmitter")(app)

app.use(cors({
  preflightContinue: true,
  credentials: true,
})); // CORS 설정
app.use(error.initModule)
app.use('/api-docs', apiDocs);
app.use(settingTransmitter)

// db
var sequelize = require('./models').sequelize;
sequelize.sync({ force: false }).then(()=>{
    console.log("Successfully connect to server")
    require("./create_new_record")()
}).catch((err)=>{
    console.log(err)
});

// router
app.use("/api", require("./api"))
app.get('/test', (req, res) => res.send('Hello World!'))

app.use(express.static('public'));

// open
app.listen(app.get("port"), () => {
        console.log(`Example app listening on port ${port}!`)
    }
)