import express from 'express';

const webRoutes = express.Router();

webRoutes.use('/', (req, res) => {
    res.status(200).json({ dev: "gitlab.com/Foks132" })
});

export default webRoutes;
