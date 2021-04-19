import http from "http";
import express from "express";
import bodyParser from "body-parser";
import logging from "./config/logging";
import config from "./config/config";
import mongoose from "mongoose";
import shoppingCartRoutes from "./routes/shoppingCart";
import userRoutes from "./routes/user";

const NAMESPACE = "Server";
const router = express();

mongoose
  .connect(
    `${config.mongo.hostname}/${config.mongo.dbname}`,
    config.mongo.options
  )
  .then((result) => {
    logging.info(NAMESPACE, "Connected to mongo DB", null);
  })
  .catch((error) => {
    logging.error(NAMESPACE, error.message, error);
  });

router.use((req, res, next) => {
  logging.info(
    NAMESPACE,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`,
    null
  );

  res.on("finish", () => {
    logging.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`,
      null
    );
  });

  next();
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow Methods", "GET PATCH DELETE POST PUT");
    return res.status(200).json({});
  }

  next();
});

router.use("/api", shoppingCartRoutes);
router.use("/api", userRoutes);

router.use((req, res, next) => {
  const error = new Error("Not Found");
  return res.status(404).json({
    message: error.message,
  });
});

const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => {
  logging.info(
    NAMESPACE,
    `Server running on ${config.server.hostname}:${config.server.port}`,
    null
  );
});
