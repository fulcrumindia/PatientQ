const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'view')));

// index route
app.get('/',(req,res)=>{
    res.send('Hello World');
});

// start server
app.listen(port, () => {
    console.log('Server running on port :'+port);
});