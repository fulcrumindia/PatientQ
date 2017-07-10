const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const app = express();
const port = 3000;
 
// import
const config = require('./config/database');
const Queue = require('./model/Queue');
const Patient = require('./model/Patient');

// handlebars config
var viewsPath = path.join(__dirname, 'view');
app.set('views',viewsPath);
app.engine('hbs', hbs({extname: 'hbs', defaultLayout:'layout', layoutsDir: viewsPath+'/layouts', partialsDir: viewsPath+'/partials' }));
app.set('view engine','hbs');


// connect to mongoose db
mongoose.connect(config.database);

// on connection
mongoose.connection.on('connected',() => {
    console.log('Connected to database '+config.database);
});

// on error
mongoose.connection.on('error',(err) => {
    console.log('Database Error '+err);
});

app.use(bodyParser.urlencoded({
    extended: true
}));

// static path
app.use(express.static(path.join(__dirname, 'public')));

// index route
app.get('/',(req,res)=>{
    res.render('login');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/managequeue',(req,res)=>{
    Queue.getQueues((err, queues) =>{
        if(err){
            throw err;
        } else {
            //console.log(queues);
            res.render('managequeue',{queues:queues});
        }
    });    
});

app.post('/addpatient',(req,res)=>{
    patient = req.body;
    Patient.addPatient(patient, (err, patient) =>{
        if(err){
            //console.log(err);
            throw err;
        } 

        Queue.getQueueById(patient._queueId,(err, queue) =>{
            if(err){
                throw err;
            } else {
                //console.log(queue);
                queue._patientIds.push(patient);
                queue.save();

                res.redirect('/managequeue');
            }
        });    
    });   
});

app.get('/queuebuilder',(req,res)=>{
    Queue.getQueues((err, queues) =>{
        if(err){
            throw err;
        } else {
            res.render('queuebuilder',{queues:queues});
        }
    });    
});

app.get('/add-queue',(req,res)=>{
    var _id = req.query.a;
    if(typeof _id !== 'undefined'){
        Queue.getQueueById(_id, (err, queue) =>{
            if(err){
                throw err
            } else {
                res.render('add-queue',{queue:queue});
            }
        });    
    } else {
        res.render('add-queue');
    }
});

app.post('/queuebuilder/:_id',(req,res)=>{
    var _id = req.params._id;
    if(typeof _id !== 'undefined' && _id != ''){
        Queue.updateQueue(_id, req.body , {}, (err, data) =>{
            if(err){
                throw err
            } 
        });
    } 
 
    res.redirect('/queuebuilder');
});

app.post('/queuebuilder',(req,res)=>{
    Queue.addQueue(req.body, (err, data) =>{
        if(err){
            throw err;
        } 
    });

    res.redirect('/queuebuilder');
});

app.get('/delete-queue/:_id',(req,res)=>{
     var _id = req.params._id;
    if(typeof _id !== 'undefined' && _id != ''){
        Queue.deleteQueue(_id, (err, data) =>{
            if(err){
                throw err;
            } 
        });
    }

    res.redirect('/queuebuilder');
});

app.get('/sent-log',(req,res)=>{
    res.render('sent-log');
});

app.get('/advertising',(req,res)=>{
    res.render('advertising');
});

app.get('/queuesetting',(req,res)=>{
    res.render('queuesetting');
});

app.get('/store-timing',(req,res)=>{
    res.render('store-timing');
});

app.get('/app',(req,res)=>{
    res.render('app');
});

// start server
app.listen(port, () => {
    console.log('Server running on port :'+port);
});