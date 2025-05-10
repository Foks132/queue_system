import { WindowService } from "../services/windowService.js";
import { joinWindowValidation } from "../utils/validation.js";

const WindowController = {
    join: async (req, res) => {
        try {
            const { error } = joinWindowValidation(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });
            const { userId, windowId } = req.body;
            let result = await WindowService.join(userId, windowId);
            if (!result) return res.sendStatus(404);

            result = {
                id: result.id,
                login: result.login,
                userPermission: Object.values(result.userPermission.map((permission) => (permission.appealType))),
                window: Object.values(result.window.map((window) => (window))),
            }
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message });
        }
    },

    quit: async (req, res) => {
        try {
            const { error } = joinWindowValidation(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });
            const { userId, windowId } = req.body;
            let result = await WindowService.quit(userId, windowId);
            if (!result) return res.sendStatus(404);

            result = {
                id: result.id,
                login: result.login,
                userPermission: Object.values(result.userPermission.map((permission) => (permission.appealType))),
                window: Object.values(result.window.map((window) => (window))),
            }
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message });
        }
    },
}

export default WindowController;