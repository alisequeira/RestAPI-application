const path = require('path');

const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const multer = require('multer');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toDateString() + '_' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false)
    }
}

app.use(bodyParser.json());//application/json
//Upload images
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

//Serving Images statically
app.use('/images', express.static(path.join(__dirname, 'images')))
//CORS error approach 
app.use((req, res, next) => {
    //set all the urls/domains that should be able to access our server.
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Tell the client which method are allowed 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    //Set Header that the client might set on their request.
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //Call next so the request can continue properly.
    next();
});
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

//Error handling functionality middleware
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose.connect('mongodb+srv://pOOz:SmZJ1dJKlQxAFMsp@restapi.mrrru.mongodb.net/pOOz?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => console.log('connected to DB!'))
    .catch(error => console.log(error.message))
app.listen(8080, process.env.Ip, () => console.log('server listening at port 8080'));