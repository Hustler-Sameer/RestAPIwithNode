const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const cors = require('cors');

const feedRoutes = require('./routes/feed');
const mongoose = require('mongoose');
const multer = require('multer');


const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
//upload file part 

const fileStorage = multer.diskStorage({
    destination: (req, file, callbackFn) => {
        // callbackFn(null, path.join(__dirname, 'images'));
        callbackFn(null , 'images')

    },
    filename: (req, file, callbackFn1) => {
        callbackFn1(null, new Date().toISOString().replace(/:/g, '-')  + file.originalname);
    }
})
const fileFilter1 = (req, file, callbackFn2) => {
    if (file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg') {
     callbackFn2(null , true);   
    }else{
        callbackFn2(null , false );
    }
}
app.use(multer({storage: fileStorage , fileFilter: fileFilter1}).single('image'));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json



app.use('/feed', feedRoutes);
app.use("/images", express.static(path.join(__dirname, 'images')));


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });

})



mongoose.connect(
    "mongodb+srv://sameerkurkure22:ODctwBlLKEahQGwH@restapi.owwdwfh.mongodb.net/?retryWrites=true&w=majority&appName=RestApi"
).then(
    result => {
        app.listen(8080, () => {
            console.log(`The app is running on port 8080`);
        });
    }
).catch(err => console.log(err))
// app.use(cors({ origin: 'http://localhost:3000' }));
// 
// sameerkurkure22
// pr@nit@123

// ODctwBlLKEahQGwH