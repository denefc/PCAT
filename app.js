const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ejs = require("ejs");
const path = require("path");
const Photo=require('./models/Photo');
const methodOverride = require('method-override');

const photoController=require('./controllers/photoControllers')
const pageController = require('./controllers/pageController');


const app = express();

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db',{
  useNewUrlParser:true,
  useUnifiedTopology:true,  
  useFindAndModify: false,
});


//templates engine
app.set("view engine", "ejs");


//mıddleware
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(fileUpload())
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//Routes
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
