

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://FinalProj:FinalProj@cluster0.itndudq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const dbName = "Final";
const collectionName = "Final";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://FinalProj:FinalProj@cluster0.itndudq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

var roomSchema = mongoose.Schema({
  roomname: String,
  type: String,
  state: String,
});
var Room = mongoose.model("Person", roomSchema, "room");

var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var app = express();

var roomSchema = mongoose.Schema(
  {
    roomname: String,
    type: String,
    state: String,
  },
  { collection: "room" }
);

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/postroom", function (req, res) {
  res.render("postroom");
});

app.get("/rooms", function (req, res) {
  Room.find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error in retrieving room" });
    });
});

app.get("/deleteroom", function (req, res) {
  res.render("deleteroom");
});

app.get("/updateroom/", function (req, res) {
  res.render("updateroom");
});

app.get("/get-by-id/", function (req, res) {
  res.render("get-by-id");
});

app.get("/get-by-name/", function (req, res) {
  res.render("get-by-name");
});

app.get("/rooms/:id", async function (req, res) {
  try {
    // Log that a GET request was received
    console.log("GET request received for person with ID:", req.params.id);

    // Find the room by ID
    const person = await Room.findById(req.params.id);

    // If room is not found, return 404 Not Found
    if (!person) {
      return res
        .status(404)
        .json({ message: "Room with id " + req.params.id + " not found." });
    }

    // If room is found, return it as JSON response
    res.json(person);
  } catch (err) {
    // Log any errors that occur during the operation
    console.error("Error occurred:", err);

    // Send a 500 Internal Server Error response with an error message
    res
      .status(500)
      .json({ message: "Error in retrieving person with id " + req.params.id });
  }
});

app.get("/rooms/roomname/:roomname", async function (req, res) {
  try {
    // Log that a GET request was received
    console.log(
      "GET request received for room with name:",
      req.params.roomname
    );

    // Find the room by roomname
    const room = await Room.findOne({ roomname: req.params.roomname });

    // If room is not found, return 404 Not Found
    if (!room) {
      return res
        .status(404)
        .json({
          message: "Room with name " + req.params.roomname + " not found.",
        });
    }

    // If room is found, return it as JSON response
    res.json(room);
  } catch (err) {
    // Log any errors that occur during the operation
    console.error("Error occurred:", err);

    // Send a 500 Internal Server Error response with an error message
    res
      .status(500)
      .json({
        message: "Error in retrieving room with name " + req.params.roomname,
      });
  }
});

app.put("/rooms/:id", async function (req, res) {
  try {
    console.log("PUT request received");
    console.log("ID parameter:", req.params.id);
    console.log("Request body:", req.body);

    const response = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log("Response from database:", response);

    res.json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ message: "Error in updating room with id " + req.params.id });
  }
});

app.delete("/rooms/roomname/:roomname", async function (req, res) {
  try {
    const response = await Room.findOneAndDelete({
      roomname: req.params.roomname,
    });
    if (response === null) {
      res
        .status(404)
        .json({
          message: "Room with name " + req.params.roomname + " not found.",
        });
    } else {
      res.json({
        message: "Room with name " + req.params.roomname + " removed.",
      });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({
        message: "Error in deleting room with name " + req.params.roomname,
      });
  }
});

app.patch("/rooms/:id", async function (req, res) {
  try {
    console.log("PATCH request received");
    console.log("ID parameter:", req.params.id);
    console.log("Request body:", req.body);

    // Find the person by ID and update only the specified fields
    const response = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log("Response from database:", response);

    // Check if the person with the given ID exists
    if (!response) {
      return res
        .status(404)
        .json({ message: "Room with id " + req.params.id + " not found." });
    }

    // Send the updated person data as a response
    res.json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ message: "Error in updating room with id " + req.params.id });
  }
});

app.set("view engine", "pug");
app.set("views", "./views");

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

app.post("/postroom", function (req, res) {
  var roomInfo = req.body; // Get the parsed information

  if (!roomInfo.roomname || !roomInfo.type || !roomInfo.state) {
    res.render("show_message", {
      message: "Sorry, you provided wrong info",
      type: "error",
    });
  } else {
    var newRoom = new Room({
      roomname: roomInfo.roomname,
      type: roomInfo.type,
      state: roomInfo.state,
    });

    newRoom
      .save()
      .then((savedRoom) => {
        res.render("show_message", {
          message: "New room added",
          type: "success",
          room: roomInfo,
        });
      })
      .catch((error) => {
        res.render("show_message", {
          message: "Database error",
          type: "error",
        });
      });
  }
});

app.post("/", function (req, res) {
  console.log(req.body);
  res.send("recieved your request!");
});

app.listen(3000);
