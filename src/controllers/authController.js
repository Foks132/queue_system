import { AuthService } from "../services/authService.js";
import { loginUserValidation } from "../utils/validation.js";

const AuthController = {
    login: async (req, res) => {
        try {
            const { error } = loginUserValidation(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });
            const { login, password } = req.body;
            let result = await AuthService.login(login, password);
            if (!result) return res.sendStatus(404);

            result = {
                id: result.id,
                login: result.login,
                userPermission: Object.values(result.userPermission.map((permission) => (permission.appealType))),
                window: result.window,
            }
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message });
        }
    },
}

export default AuthController;