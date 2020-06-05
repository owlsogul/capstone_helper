const express = require('express')
const app = express()

app.use(express.json())

// application variable setting
app.set("port", 30082)


// github webhook
app.use("/api/push", require("./push"))

// open
app.listen(app.get("port"), () => {
        console.log(`Webhook deamon app listening on port ${app.get("port")}!`)
    }
)
