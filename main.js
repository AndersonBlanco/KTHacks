const express = require('express');

const app = express();

app.get("/", (req, res) =>{
    res.send("Hello Universe"); 
    res.end();
})

app.listen(3000, () =>{
    console.log("Server live!")
})