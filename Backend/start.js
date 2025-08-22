import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import server from "./express";

// # DotEnv configuration
// letting it know where to look for the .env file
dotenv.config({ path: path.resolve(__dirname + "/.env") });

// # DB Connection
// # Mongoose connecting
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI);

console.log("*********************************************************");

// # Opening the Connection
const db = mongoose.connection;
db.once("open", () => {
  console.log(
    "**------------- PROCESS ENV:",
    process.env.NODE_ENV,
    " -------------**"
  );
  console.log("**------------- CONNECTED TO THE DATABASE -------------**");
  console.log("*********************************************************");
});

// ! Detecting Connection Error
db.on("error", () => {
  console.log(
    "** UNABLE TO CONNECT TO DATABASE(",
    process.env.MONGODB_URI,
    "(thus stopping the server) **"
  );
  process.exit();
});

// # Server Start
const actualPort = process.env.PORT || 10000;
server.listen(actualPort, (err) => {
  if (err) {
    console.log(
      "**------------- SERVER ERROR:",
      err,
      "(thus stopping the server)-------------**"
    );
    process.exit();
  }

  console.log(
    "**------------- SERVER STARTED ON PORT:",
    actualPort,
    "----------**"
  );
});
