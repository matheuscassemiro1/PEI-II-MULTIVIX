import express from 'express';
import bodyParser from 'body-parser';
import { JsonDB, Config } from 'node-json-db'
import cron from 'node-cron';
import { createServer } from "http"
import cors from 'cors'

import { env } from './env/environment.js';
import { apiRouter } from './routes/api.js';
import { prefeituraController } from './controller/prefeituraController.js';
import { usuarioController } from './controller/usersController.js';
import { whatsappController } from './controller/whatsappController.js';

//SETUP DO SERVIDOR
export const app = express();
export const httpListener = createServer(app);


//RECEPÇÃO DE DADOS E CABEÇALHO
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.disable('X-Powered-By');

///CORS --> Em breve manter o Origin como apenas o da API do Whatsapp
app.use(cors({
    origin: '*',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie'],
    methods: "GET,HEAD,OPTIONS,POST,PUT,DELETE"
}));
app.use('', apiRouter)

/// AGENDAMENTO DISPARA A CADA 6H
const tarefa = cron.schedule('* */6 * * *', async () => {
    prefeituraController.buscarAtualizacao();
    console.log("cronjob executado")
    console.log(new Date().toTimeString())
}, { scheduled: false });

httpListener.listen(env.PORTA, async () => {
    tarefa.start();
    whatsappController.enviarMsg()
    console.log(`Aplicação ligada na porta ${env.PORTA}`)
})