const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.epUsers = "/api/users";

    // Conectar a base de datos
    this.dbConnection();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicacion
    this.routes();
  }

  async dbConnection() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Parseo y lectura del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.epUsers, require("../routers/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("listening on port: " + this.port);
    });
  }
}

module.exports = Server;
