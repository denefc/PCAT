const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const fs = require('fs');

const ejs = require("ejs");
const path = require("path");
const Photo=require('./models/Photo');
const methodOverride = require('method-override');


const app = express();

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db',{
  useNewUrlParser:true,
  useUnifiedTopology:true
});


//templates engine
app.set("view engine", "ejs");


//mıddleware
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(fileUpload())
app.use(methodOverride('_method'));

//Routes
app.get("/", async(req, res) => {
  const photos=await Photo.find({}).sort('-dateCreated');
  res.render("index",{
    photos,
  });
});
app.get("/photos/:id",async (req, res) => {
  const id=req.params.id
  const photo=await Photo.findById(id);
  res.render("photo",{
    photo,
  })
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/photos", (req, res) => {

const uploadDir = 'public/uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

let uploadeImage = req.files.image;
let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;

uploadeImage.mv(uploadPath, async () => {
  await Photo.create({
    ...req.body,
    image: '/uploads/' + uploadeImage.name,
  });
  res.redirect('/');
});
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title
  photo.description = req.body.description
  photo.save()

  res.redirect(`/photos/${req.params.id}`)
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
