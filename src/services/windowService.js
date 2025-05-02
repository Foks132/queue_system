import { dbPrisma } from "../utils/database.js"

export const WindowService = {
    join: async (userId, windowId) => {
        const window = await dbPrisma.window.findUnique({ 
            where: { 
                id: Number(windowId), 
            } 
        });
        if (!window) throw new Error("Window not found");
        const userPermissions = await dbPrisma.userPermission.findMany({
            where: { 
                userId: Number(userId), 
            },
        });
        const hasPermission = userPermissions.some(permission => permission.appealType === window.type);
        if (!hasPermission) throw new Error("User does not have permission to join this window");
        const user = await dbPrisma.user.update({
            where: { 
                id: Number(userId),
            },
            data: {
                window: {
                    connect: {
                        id: Number(windowId),
                    }
                }
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
                }
            },
        });
        return user;
    }
}