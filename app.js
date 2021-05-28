const express = require("express");
const mongoose = require("mongoose");

const ejs = require("ejs");
const path = require("path");
const Photo=require('./models/Photo');


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

//Routes
app.get("/", async(req, res) => {
  const photos=await Photo.find({})
  res.render("index",{
    photos
  });
});
app.get("/photos/:id",async (req, res) => {
  const id=req.params.id
  const photo=await Photo.findById(id);
  res.render("photo",{
    photo
  })
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/photos", (req, res) => {
  Photo.create(req.body)
  res.redirect("/")
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
