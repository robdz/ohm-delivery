const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("./middleware/cors");
const error = require("./middleware/error");
const routes = require("./routes");
const notFound = require("./middleware/notFound");

function serve() {
  app.use(bodyParser.json());
  app.use(cors(["http://localhost:8000"]));

  app.use(routes());
  app.use(notFound());
  app.use(error());

  app.listen(3000, () => console.log("listening on port 3000"));
}

serve();
