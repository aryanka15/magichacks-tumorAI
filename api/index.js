const express = require("express");
const routes = require("./routes/routes.js");
const cors = require("cors");
const port = 8888;

const app = express();

app.use(cors());
app.use("/", routes);

app.get("/", (req, res) => res.send("Please add a file to the website"));

app.listen(port);
