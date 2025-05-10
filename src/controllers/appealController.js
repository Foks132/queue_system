import { createAppealValidation } from "../utils/validation.js";
import { AppealService } from "../services/appealService.js";

const AppealController = {
    all: async (req, res) => {
        try {
            const { status, types } = req.query;
            let result = await AppealService.all(status, types);
            if (!result) return res.sendStatus(404);

            result = result.map((appeal) => ({
                code: appeal.code,
                type: appeal.type,
                status: appeal.status,
                window: appeal.window,
            }))
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message });
        }
    },

    create: async (req, res) => {
        try {
            const { error } = createAppealValidation(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });
            const data = req.body;
            let result = await AppealService.create(data);
            if (!result) return res.sendStatus(404);
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message });
        }
    },

    accept: async (req, res) => {
        try {
            const { userId, appealId } = req.body;
            let result = await AppealService.accept(userId, appealId);
            if (!result) return res.sendStatus(404);
            console.log(result);
            result = {
                code: result.code,
                type: result.type,
                status: result.status,
                windowId: result.window[0].id,
                userId: result.window[0].user[0].id,
            }
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message });
        }
    },

    close: async (req, res) => {
        try {
            const { userId, appealId } = req.body;
            let result = await AppealService.close(userId, appealId);
            if (!result) return res.sendStatus(404);
            console.log(result);
            result = {
                code: result.code,
                type: result.type,
                status: result.status,
                windowId: result.window[0].id,
                userId: result.window[0].user[0].id,
            }
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message });
        }
    }
}

export default AppealController;