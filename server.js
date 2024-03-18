const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const routes = require("./server/routes");
const config = require('./server/config/config');

const prodMode = config.prodMode;
const port = config.serverPort || 3080;
app.use(bodyParser.json());

app.use(express.static(process.cwd() + "/ui/dist/kspot-example-ui/"));

//Serve out the api
app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + "/ui/dist/kspot-example-ui/index.html")
});

if (prodMode) {
	app.use(express.static("ui/dist/kspot-example-ui"));
}

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
