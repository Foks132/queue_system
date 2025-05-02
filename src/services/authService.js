import { dbPrisma } from "../utils/database.js"

export const AuthService = {
    login: async (login, password) => {
        const user = await dbPrisma.user.findFirst({
            where: { 
                AND: [
                    {
                        login: login, 
                    },
                    {
                        password: password,
                    }
                ]
            },
            select: {
                id: true,
                login: true,
                userPermission: {
                    select: {
                        appealType: true,
                    }
                },
                window: {
                    select: {
                        window: true,
                    }
                },
            }
        });
        return user;
    }
}