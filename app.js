const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
var handlebars = require('handlebars');
const fs = require('fs');
var async = require("async");
const app = express();
passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var moment = require('moment');
const port = 8083;

// import
const config = require('./config/database');
const Queue = require('./model/Queue');
const Patient = require('./model/Patient');
const QueueSettings = require('./model/QueueSettings/QueueSettings.model');
const dashboard=require('./data/dashboard.json');
const doctors=require('./data/doctors.json');
const analytics = require('./data/analytics.json');

// handlebars config
var viewsPath = path.join(__dirname, 'view');
var imagePath = path.join(__dirname, 'images');
app.set('views',viewsPath);
app.engine('hbs', hbs({
    extname: 'hbs', 
    defaultLayout:'layout', 
    helpers: require("./helpers/helpers.js").helpers,
    layoutsDir: viewsPath+'/layouts', 
    partialsDir: viewsPath+'/partials' 
}));
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

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

require('./config/passport')(passport); // pass passport for configuration

// static path
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'patientQmaster' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Call routes
var routes = require('./routes');
app.use('/', routes);

// index route
app.get('/',(req,res)=>{
    if(req.session.user)
        res.redirect('/queuebuilder');
    else
        res.render('login', { message: req.flash('loginMessage') });
});

app.get('/login',(req,res)=>{
    if(req.session.user)
        res.redirect('/queuebuilder');
    else
        res.render('login', { message: req.flash('loginMessage') });
});

app.get('/signup',(req,res)=>{
    if(req.session.user)
        res.redirect('/queuebuilder');
    else
        res.render('signup', { message: req.flash('signupMessage') });
});

app.get('/test', isLoggedIn,(req,res)=>{
    QueueSettings.getQueueSettings((err,data) =>{
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
    });
});

app.get('/managequeue', isLoggedIn,(req,res)=>{
    Queue.getQueues((err, queues) =>{
        if(err){
            throw err;
        } else {
            //console.log(queues);
            Queue.findQueueByType('T',(err,queues1)=>{
                //console.log(queues1[0]._id);
                res.render('managequeue',{doctors:doctors,queues:queues,queueByType:queues1[0]});
            });
            
        }
    });    
});

app.post('/addpatient', isLoggedIn,(req,res)=>{
    newPatient = req.body;
    Patient.addPatient(newPatient, (err, patient) =>{
        if(err){
            //console.log(err);
            throw err;
        } 

        Queue.getQueueById(patient._queueId,(err, queue) =>{
            if(err){
                throw err;
            } else {
                //console.log(queue);
                //console.log(patient);
                queue._patientIds.push(patient);
                queue.save();

                res.redirect('/managequeue');
            }
        });    
    });   
});

app.get('/rpatient/:_id', isLoggedIn,(req,res)=>{
    var _id = req.params._id;
    // remove patient id from old queue
    Patient.getPatientById(_id,(err,patient) => {
        Queue.getQueueById(patient._queueId,(err, queue) =>{
            //console.log(patient._queueId);
            queue._patientIds.remove(patient);
            queue.save(); 

            res.redirect('/managequeue');
        });
    });
});

app.get('/updatePatientDoctor/:_patientId/:_docId', isLoggedIn,(req,res)=>{
    var patientId = req.params._patientId;
   
    var newPatient = {
        doctorId: req.params._docId
    }
    Patient.updatePatientDetails(patientId, newPatient , {}, (err, patient) =>{
        
    });
    //res.redirect('/managequeue');
});   

app.get('/patient/:_id/:queueId', isLoggedIn,(req,res)=>{
    var _id = req.params._id;

    if(typeof _id !== 'undefined' && _id != ''){
        async.waterfall([
            // get patient old queue id
            function(callback) {
                Patient.getPatientById(_id,(err,patient) => {
                    //console.log(patient);
                    callback(null,patient);
                });
            },
            // remove patient id from old queue
            function(patient,callback){
                Queue.getQueueById(patient._queueId,(err, queue) =>{
                    //console.log(patient._queueId);
                    queue._patientIds.remove(patient);
                    queue.save(); 
                    callback(null);
                });
            },
            // update patient with new queue id
            function(callback){
                var newPatient = {
                    _queueId: req.params.queueId
                }
                Patient.updatePatientDetails(_id, newPatient , {}, (err, patient) =>{
                    callback(null,patient);
                });
            },
            //update queue with new patient id
            function(patient,callback){
                 Queue.getQueueById(req.params.queueId, (err, queue) =>{
                     queue._patientIds.push(patient);
                     queue.save(); 
                     callback(err, queue);
                 });
            }

        ], function (err, result) {
            // result now equals 'done'
            res.redirect('/managequeue');
        });   
    } 
});

app.get('/patientMiniModal/:_patientId', isLoggedIn,(req,res)=>{
    var _id = req.params._patientId;
    Patient.getPatientById(_id,(err,patient) => {
        console.log(err);
        fs.readFile('view/modals/patient-mini-details.hbs', function(err, data) {  
            if(err)
                console.log(err);
            else{
                var source = data.toString();
                var template = handlebars.compile(source);
                var outputString = template({patient:patient});

                res.writeHead(200, { 'Content-Type': 'text/html' });  
                res.end(outputString, "utf-8"); 
            }
        });
    });
});

app.get('/queuebuilder', isLoggedIn,(req,res)=>{
    Queue.getQueues((err, queues) =>{
        if(err){
            throw err;
        } else {
            res.render('queuebuilder',{queues:queues});
        }
    });    
});

app.get('/add-queue', isLoggedIn,(req,res)=>{
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

app.post('/queuebuilder/:_id', isLoggedIn,(req,res)=>{
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

app.post('/queuebuilder', isLoggedIn,(req,res)=>{
    Queue.addQueue(req.body, (err, data) =>{
        if(err){
            throw err;
        } 
    });

    res.redirect('/queuebuilder');
});

app.get('/delete-queue/:_id', isLoggedIn,(req,res)=>{
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

app.get('/sent-log', isLoggedIn,(req,res)=>{
    res.render('sent-log');
});

app.get('/advertising', isLoggedIn,(req,res)=>{
    res.render('advertising');
});

app.get('/queuesetting', isLoggedIn,(req,res)=>{
    res.render('queuesetting');
});

app.get('/store-timing', isLoggedIn,(req,res)=>{
    res.render('store-timing');
});

app.get('/app', isLoggedIn,(req,res)=>{
    res.render('app');
});

app.get('/dashboard', isLoggedIn,(req,res)=>{
    res.render('dashboard',{dashboard:dashboard,imagePath:"/images"});
});

app.get('/profile', isLoggedIn,(req,res)=>{
    res.render('profile',{title:'Profile'});
});
app.get('/analytics', isLoggedIn,(req,res)=>{
    var result = [];
    var startDate = moment().subtract(5, 'months').format('YYYY,MM,DD');
    var endDate = moment().add(1,'day').format('YYYY,MM,DD');
     Patient.getVisitGraph(startDate,endDate,(err,data)=>{
         if(err){
             throw err;
         }
         else{
         for(i=0;i< data.length;i++)
         {
              d = data[i];
             result.push({period:moment(d._id.month, 'MM').format('MMM'),OPD:d.visits});
         }

    res.render('analytics',{title:'Analytics',analyticsData:analytics,newVisitAnalytics:result});
          
         }
        });
});
app.get('/referralconnect', isLoggedIn,(req,res)=>{
    res.render('referralconnect',{title:'Referral Connect'});
});
app.get('/messagelog', isLoggedIn,(req,res)=>{
    res.render('messagelog',{title:'Message Log'});
});
app.get('/support', isLoggedIn,(req,res)=>{
    res.render('support',{title:'Support'});
});
app.get('/tutorial', isLoggedIn,(req,res)=>{
    res.render('tutorial',{title:'Tutorial'});
});


app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
});

app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/signup', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/managequeue', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
// start server

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.listen(port, () => {
    console.log('Server running on port :'+port);
});