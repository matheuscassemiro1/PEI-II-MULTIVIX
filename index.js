import express from 'express';
import bodyParser from 'body-parser';
import { JsonDB, Config } from 'node-json-db'
import cron from 'node-cron';
import { createServer } from "http"
import cors from 'cors'
import { env } from './env/environment.js';
import { apiRouter } from './routes/api.js';
import { prefeituraController } from './controller/prefeituraController.js';
//SETUP DO SERVIDOR
export const app = express();
export const httpListener = createServer(app);
import { database } from './database.js';

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
}, { scheduled: false });
prefeituraController.buscarAtualizacao();

httpListener.listen(env.PORTA, async () => {
    tarefa.start();
    console.log(`Aplicação ligada na porta ${env.PORTA}`)
})