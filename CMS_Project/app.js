const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const {connection_url, PORT} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session')
const {globalVariables} = require('./config/configuration');
const methodOverride = require('method-override');
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
const passport = require('passport');

// app config
const app = express();

// Middlewares -express config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

// Db Config
mongoose.set('strictQuery', false);
mongoose.connect(connection_url)
    .then(response => {
        console.log("Mongodb connected successfully")
    }).catch(err => {
        console.log("Mongodb connected successfully")
    })


// Flash and session
app.use( session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true,
}))
app.use(flash());

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

/* Use Global Variables */
app.use(globalVariables);


/* File Upload Middleware*/
app.use(fileUpload());

// Setup view engine  to use handlebars

app.engine('handlebars', expressHandlebars.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'user', 
    helpers: { select: selectOption } 
}).engine);
app.set('view engine', 'handlebars');

//method override
app.use(methodOverride('newMethod'))

//api endpoint - routes

// app.get("/", (req, res) => res.status(200).send("Content management system demo"))
// app.use('/', (req,res) => {
//     res.render('user/index');
// });

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', userRoutes); 
app.use('/admin', adminRoutes);

//listening
app.listen(PORT, () => {
    console.log(`Listening on localhost: ${PORT}`);
}); 
