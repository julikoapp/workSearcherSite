const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", 'ejs');

mongoose.connect("mongodb://localhost:27017/WorkerApplyDB", {useNewUrlParser:true, useUnifiedTopology: true});

const workerSchema = new mongoose.Schema({
    email: String, 
    name: String, //maybe array of name and Last name??
    dateBirth: String,
    education: String,
    about: String
})

const Worker = mongoose.model("Worker", workerSchema);



app.get("/", function(req, res){
    res.sendFile(__dirname + "/landingpage.html");
})
app.get("/contact", function(req, res){
    Worker.find({}, function(err, found){
        if (found.length === 0){
            const worker = new Worker({
                email:  "yula.barko@gmail.com",
                name: "Юлия Барко",
                dateBirth: "03.07.2002",
                education: "самообразование",
                about: "Заинтересована в программировании. \n Что я не знаю,  то я могу изучить. "
            })
            worker.save();
        }
    });
    res.sendFile(__dirname + "/formsite.html");

});

app.get("/choice", function(req,res){
    res.sendFile(__dirname + "/success.html");
})

app.get("/list", function(req, res){
    Worker.find({}, function(err, workers){
        res.render("workerlist", {workerObj: workers});
    })
})

app.post("/",function(req, res){
    res.redirect("/contact");
});

app.post("/contact", function(req, res){
    
    var newName = req.body.nameWork;



    const worker = new Worker({
        email:  req.body.email,
        name: newName,
        dateBirth: String(req.body.dateWork),
        education: req.body.eduWork,
        about: req.body.aboutWork
        });
        worker.save(function(err){
            if (err){
                console.log(err);
            } else{
                res.redirect("/choice");
            }
        });

});




app.listen("4090", function(){
    console.log("server started on port 4090");
})