require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//Require Express
const app = express();

//Middleware
const { requireAuth, checkUser } = require('./middleware/authMiddleware.js');

//Routing
const authRouter = require('./routes/authRouter.js');

//View engine
app.set('view engine', 'ejs');


//Use-cases    
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());


//Port & DB connection
const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_LINK, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})
    .then((result) => app.listen(port, () => {
        console.log(`Listening to port: ${port} and connected to Database`);
    }))
    .catch((err) => console.log(err))



//Routes
app.get('*', checkUser);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/smoothies', requireAuth, (req, res) => {
    res.render('smoothies');
});

app.use(authRouter);