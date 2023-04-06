const express = require("express");

const hostname = "0.0.0.0";
const port = 3000; 
const server = express();

const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

mongoose.connect("mongodb://mongo/apinode");

server.use(express.urlencoded()); // url encodé pour save les données encodé dans des fichiers json
server.use(express.json());

const postRoute = require("./api/routes/postRoute");
postRoute(server);

const commentRoute = require("./api/routes/commentRoute");
commentRoute(server);

const userRoute = require("./api/routes/userRoute");
userRoute(server);


server.listen(port, hostname);
