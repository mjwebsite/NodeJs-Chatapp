const express = require('express');
const path = require("path")
const dotenv = require('dotenv')
const cors = require('cors');
const http = require("http")
const router = require("./routs/routs");
const chatRoutes =require('./routs/chatRoutes');
const messageRoutes = require('./routs/messageRoutes')
const globalErrorHandler = require("./errorHandler/errorController");
const AppError = require("./errorHandler/appError");
// const { Server, Socket } = require("socket.io")


dotenv.config()

const app = express();
//const pool = require('./db/db')

app.use(express.urlencoded({ extended: 'false' }))
app.use(express.json())
const corsOptions = {
  credentials: true,
  origin: 'http://localhost:3000', // Whitelist the domains you want to allow
  methods: ["GET", "POST"]
};

app.use(cors(corsOptions));
var cons = require('consolidate');
const session = require('express-session');
const cookieparser = require('cookie-parser');


app.use("/api/user", router);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(cookieparser());
app.use(session({
  secret: "Hello world..",
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true }
}));

const db = require("./models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// log.info("ok")
app.all("*",(req, res, next) => {
  // if(res && res._construct === )
  let err = new AppError({
    "errorCode": "URL_Invalid",
    "description": `Can't find ${req.originalUrl} on the server`,
    "type": "E"
  });
  err.status = "Not found";
  next(err)

})
app.use(globalErrorHandler);

// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: '*', // Whitelist the domains you want to allow
//     methods: ["GET", "POST"]
//   }
// });
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server started on port 5000")
})

// io.on('connection', (socket) => {
//   console.log(socket.id);
// });

