const express = require('express')
const app = express()
const port = 80

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json())

// db
var sequelize = require('./models').sequelize;
sequelize.sync({ force: true }).then(()=>{
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