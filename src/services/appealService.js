import { dbPrisma } from "../utils/database.js"
import { APPEAL_TYPE_PREFIX } from "../utils/constants.js";

export const AppealService = {
    all: async (status = undefined, types = undefined) => {
        let appeal;
        if (types && types.length > 0) {
            appeal = await dbPrisma.appeal.findMany({
                where: {
                    status: status ?? undefined,
                    type: types.length > 0 ? {
                        in: types,
                    } : undefined,
                }
            });
        }
        else {
            appeal = await dbPrisma.appeal.findMany({
                where: {
                    status: status ?? undefined
                }
            });
        }
        return appeal;
    },

    create: async (appealData) => {
        const { type } = appealData;
        const lastAppeal = await dbPrisma.appeal.findFirst({
            where: {
                status: {
                    in: ['open', 'process']
                },
                type: type,
            },
            orderBy: {
                id: 'desc',
            },
        });

        const lastNumber = lastAppeal ? parseInt(lastAppeal.code.slice(1), 10) : 0;
        const newCode = (lastNumber + 1).toString().padStart(3, '0');;
        const prefix = APPEAL_TYPE_PREFIX[type] || 'Я';
        const code = `${prefix}${newCode}`;

        const appealCreate = {
            code: code,
            type: type,
        }
        const appeal = await dbPrisma.appeal.create({ data: appealCreate });
        return appeal;
    },

    accept: async (userId, appealId) => {
        const appeal = await changeStatusAppeal(userId, appealId, 'open', 'process');

        return appeal;
    },

    close: async (userId, appealId) => {
        const appeal = await changeStatusAppeal(userId, appealId, 'process', 'closed');

        return appeal;
    }
}

const changeStatusAppeal = async (userId, appealId, statusOld, statusNew) => {
    let appeal = await dbPrisma.appeal.findFirst({
        where: {
            id: Number(appealId),
            status: statusOld,
        },
    });
    if (!appeal) throw new Error("Appeal not found or already closed");
    
    const userPermissions = await dbPrisma.userPermission.findMany({
        where: { 
            userId: Number(userId), 
        },
    });

    const hasPermission = userPermissions.some(permission => permission.appealType === appeal.type);
    if (!hasPermission) throw new Error("User does not have permission to accept this appeal");

    const window = await dbPrisma.window.findFirst({
        where: {
            user: {
                some: {
                    id: Number(userId),
                },
            },
        },
    });
    if (!window) throw new Error("The user does not join the window");

    appeal = await dbPrisma.appeal.update({
        where: { id: appeal.id },
        data: { 
            status: statusNew,
            window: {
                connect: {
                    id: window.id,
                },
            }
         },
        include: {
            window: {
                select: {
                    user: {
                        select: {
                            id:  true,
                        }
                    },
                    id: true,
                }
            }
        },
    }); 

    return appeal;
}