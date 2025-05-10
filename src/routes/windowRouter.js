import express from "express";
import WindowController from "../controllers/windowController.js";

const windowRouter = express.Router();

windowRouter.post("/join", WindowController.join);
windowRouter.post("/quit", WindowController.quit);

export default windowRouter;
