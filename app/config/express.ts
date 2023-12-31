import * as bodyParser from "body-parser";
import express from "express";
const morgan = require("morgan");
const path = require("path");
import application from "../Constants/application";
import indexRoute from "../Routes/index";
import joiErrorHandler from "../Middlewares/joiErrorHandler";
// import * as errorHandler from '../middlewares/apiErrorHandler';
import Authenticate from "../Middlewares/Authenticate";
import session from "express-session";
import passport from "passport";
import passportService from "../Services/Google.auth.service";

var cors = require("cors");
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, token_access, user_id, User-agent"
  );
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
require("dotenv").config();
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(Authenticate);
app.use(cors());
app.use(
  session({
    secret: "job-portal",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user: any, done: any) {
  done(null, user);
}),
  passport.deserializeUser(function (user: any, done: any) {
    done(null, user);
  });
passport.use(passportService);
// Router
app.use(indexRoute);
// destination to upload file
app.use(express.static(path.join(__dirname, "public")));
// Joi Error Handler
app.use(joiErrorHandler);
// Error Handler
//app.use(errorHandler.notFoundErrorHandler);
//app.use(errorHandler.errorHandler);

export default app;
