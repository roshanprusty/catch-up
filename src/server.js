const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const handleSocketevents = require("./ws/socket");
const port = process.env.PORT || 3000;
const mongoose= require("mongoose");
const bodyParser= require("body-parser");

app.use(express.static(path.join(__dirname, "public")));

// mongoose.connect("",{useNewUrlParser:true},{useUnifiedTopology:true})
// .then(()=>{
//   console.log("Database connection done")
// }).catch(()=>{
//   console.log("something went wrong")
// })

// mongoose.connect(3001, ()=>{
//   console.log("Server is running");
// })
//creating a data schemea

const notesSchema={
  title:String,
  content:String
}
const Note=mongoose.model("Note",notesSchema);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/join", (req, res) => {
  res.render("rtc.ejs");
});

app.post("/login", function(req,res){
  let newNote=new Note({
    room:req.body.room,
    name:req.body.username
  });
  newNote.save();
  res.redirect('/login');
})
httpServer.listen(port, () => {
  console.log("Server started at port " + port);
});

// handling socket events
handleSocketevents(io);
