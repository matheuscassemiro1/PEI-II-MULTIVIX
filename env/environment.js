import { config } from 'dotenv';
import { z } from 'zod'
switch (process.env.NODE_ENV) {
    case 'development':
        config({ path: '.env.development' });
        console.log("Ambiente de desenvolvimento");
    default:
        config({ path: '.env' })
        console.log("Ambiente de produção");
}
const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production'])
        .default('development'),
    PORTA: z.coerce.number().default(80),
})

export const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    const errorMsg = "Variáveis de ambiente inválidas."
    console.error(errorMsg, _env.error.format());
    throw new Error(errorMsg)
}

export const env = _env.data