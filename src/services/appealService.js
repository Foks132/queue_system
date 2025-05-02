import { dbPrisma } from "../utils/database.js"
import { APPEAL_TYPE_PREFIX } from "../utils/constants.js";

export const AppealService = {
    all: async (status = undefined, types = undefined) => {
        types = types ? types.split(',') : [];
        const appeal = await dbPrisma.appeal.findMany({
            where: {
                status: status ?? undefined,
                type: types ? {
                    in: types,
                } : undefined,
            }
        });
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

        console.log(code);
        const appealCreate = {
            code: code,
            type: type,
        }
        const appeal = await dbPrisma.appeal.create({ data: appealCreate });
        return appeal;
    }
}