const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables from .env file
require("dotenv").config();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the environment variable
const mongoURI =
  "mongodb://127.0.0.1:27017/Project?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const authRoute = require("./routes/signup");
app.use("/", authRoute);

const authRoute = require("./routes/Form");
app.use("/", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
