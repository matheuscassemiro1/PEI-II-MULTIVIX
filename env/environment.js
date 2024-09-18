import { config } from 'dotenv';
import { z } from 'zod'
switch (process.env.NODE_ENV) {
    case 'development':
        config({ path: '.env.development' });
        console.log("Ambiente de desenvolvimento");
        break
    case 'production':
        config({ path: '.env' })
        console.log("Ambiente de produção");
        break
    default:
        console.log(process.env.NODE_ENV)
        config({ path: '.env' })
        console.log("Ambiente de produção setado automáticamente");
        break
}
const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production'])
        .default('development'),
    PORTA: z.coerce.string().default("80"),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.string(),
    DATABASE_LOGIN: z.string(),
    DATABASE_PASSWORD: z.string().nullable(),
    DATABASE_NAME: z.string(),
    DATABASE_DIALECT: z.string(),
    TELEGRAM_TOKEN: z.string()
})

export const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.log(process.env.NODE_ENV)
    const errorMsg = "Variáveis de ambiente inválidas."
    console.error(errorMsg, _env.error.format());
    throw new Error(errorMsg)
}

export const env = _env.data