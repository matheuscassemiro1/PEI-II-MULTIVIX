import express from 'express';
import bodyParser from 'body-parser';
import { JsonDB, Config } from 'node-json-db'
import cron from 'node-cron';
import { createServer } from "http"
import cors from 'cors'
import TelegramBot from 'node-telegram-bot-api';

import { env } from './env/environment.js';
import { apiRouter } from './routes/api.js';
import { prefeituraController } from './controller/prefeituraController.js';
import { usuarioController } from './controller/usersController.js';


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
app.use('', apiRouter);

/// AGENDAMENTO DISPARA A CADA 6H
const tarefa = cron.schedule('* */6 * * *', async () => {
    prefeituraController.buscarAtualizacao();
    console.log("cronjob executado");
    console.log(new Date().toTimeString());
}, { scheduled: false });

const instanciaTelegram = new TelegramBot(env.TELEGRAM_TOKEN, { polling: true })


instanciaTelegram.on('message', (mensagem) => {
    let chatId = mensagem.chat.id;
    console.log('mensagem nova');
    console.log(mensagem);
    switch (mensagem.text.toLocaleLowerCase()) {
        case '/cadastrar':
            instanciaTelegram.sendMessage(chatId, "Você foi cadastrado para receber atualizações");
            break
        case '/cancelar':
            instanciaTelegram.sendMessage(chatId, "Você cancelou o recebimento de atualizações");
            break;
        case '/atualizar':
            instanciaTelegram.sendMessage(chatId, "*Última atualização emitida pela prefeitura*");
        default:
            instanciaTelegram.sendMessage(chatId, "Comando não identificado, digite /ajuda para checar os comandos disponíveis");
            break
    }

})
httpListener.listen(env.PORTA, async () => {
    tarefa.start();
    console.log(`Aplicação ligada na porta ${env.PORTA}`)
})