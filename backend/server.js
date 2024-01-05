const express = require("express");

const app = express();

const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");

//midlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const errorHandler = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");

//db connection
const dbConnection = require("./config/db");

app.listen(process.env.PORT || 4000, (error) => {
  if (error) {
    console.log(error);
  }
  console.log("Running on port", process.env.PORT || 4000);
});

// database configuration
dbConnection();

//routes
app.use("/api/users", userRoutes);

//error middleware
app.use(errorHandler);
