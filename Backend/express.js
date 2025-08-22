import compress from "compression";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import passport from "passport";
import path from "path";
require("./passport");

// * Importing Routes
import authRoute from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

// # DotEnv configuration
// letting it know where to look for the .env file
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.resolve(__dirname + "/.env.dev") });
} else {
  dotenv.config({ path: path.resolve(__dirname + "/.env.prod") });
}

// # Server Creation
const app = express();

// # Cookie Session Middleware
app.use(
  cookieSession({
    name: "session",
    keys: ["betbuddy"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// # Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// # Middleware
app.use(cookieParser());
// parse body params and attach them to req.body
app.use(express.urlencoded({ extended: true }));
// To parse the incoming requests with JSON payloads
app.use(express.json());
app.use(compress());
// secure apps by setting various HTTP headers

if (process.env.NODE_ENV === "development") {
  app.use(helmet());
} else {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://bioversee.com/",
          "https://www.bioversee.com/",
          "https://bioreactor-0qwh.onrender.com/",
        ],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://bioversee.com/",
          "https://www.bioversee.com/",
          "https://bioreactor-0qwh.onrender.com/",
        ],
        imgSrc: ["*", "data:"],
      },
    })
  );
}

// # CORS middleware
var corsFrontendSources = process.env.PUBLIC_URL;
var corsOptions = {
  origin: corsFrontendSources,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors());

// # Routes
app.use(
  "/",
  userRoutes,
  authRoute
);

// # Serving
if (process.env.NODE_ENV === "development") {
} else {
  // serving the frontend dev, and prod folders as static resources
  app.use(
    "/",
    express.static(path.join(__dirname, "../client-react-ts/src/dist/"))
  );
  /* final catch-all route to index.html defined last; trailing / is important (!!!) */
  app.get("/*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../client-react-ts/src/dist/"));
  });
  app.use("*", function (req, res, next) {
    // serve files upon refresh window
  });

  app.use("*", function (req, res, next) {});
}

app.use("*", function (req, res, next) {});
export default app;
