import express from "express";
import AppealController from "../controllers/appealController.js";

const appealRouter = express.Router();

appealRouter.get("/all", AppealController.all);
appealRouter.post("/create", AppealController.create);

export default appealRouter;
