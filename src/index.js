import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import createError from "http-errors";
import express from "express";
import webRoutes from "./web/index.js";
import { createServer } from "node:http";
import { apiRouter } from "./routes/index.js";
import { startWebSocketServer } from "./utils/ws.js";
import cors from 'cors';

const config = dotenv.config();
dotenvExpand.expand(config);

const { NODE_HOST, NODE_PORT, APP_PROT } = process.env;

var app = express();
app.options('*', cors())
const server = createServer(app);

app.use(express.json());
app.use("/api", apiRouter);
app.use("/", webRoutes);

startWebSocketServer(server);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

server.listen(NODE_PORT, () => {
  console.log(`Server is running on ${APP_PROT}://${NODE_HOST}:${NODE_PORT}`);
});