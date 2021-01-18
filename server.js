// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
const { FORCE } = require("sequelize/types/lib/index-hints");
// Requiring passport as we've configured it
const passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
app.set("view engine", "ejs");
app.get("/recipe:userQuery", (req, res) => {
  res.render("recipe", {
    data: {
      userQuery: req.params.userQuery,
      searchResults: ["book1", "book2", "book3"]
    }
  });
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "team 1", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
