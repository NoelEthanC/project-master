require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { setupDynamicRoutes } = require("./core");
const {generateMongooseSchemas} = require("./helpers/SchemaGenerator")

//DB Connection
require("./configs/dbConfig");
const {Resources}= require("./configs/ResourceConfig")
const generatedResources =  generateMongooseSchemas(Resources)
console.log(generatedResources[0].name, generatedResources[0].endpoint)
const app = express();
app.use(express.json());
app.use(cors());

generatedResources.forEach((resource) => {
  app.use(setupDynamicRoutes(resource));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
