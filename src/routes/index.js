import express from 'express';
import authRouter from './authRouter.js';
import windowRouter from './windowRouter.js';
import appealRouter from './appealRouter.js';

export const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/window", windowRouter);
apiRouter.use("/appeal", appealRouter);