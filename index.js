//libraries
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

//others
const { MONGO_URI } = require("./config/key");

//models
require("./models/User");

app.use(express.json());

mongoose.connect(MONGO_URI);

const PORT = process.env.PORT || 5000;

//routes
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});
