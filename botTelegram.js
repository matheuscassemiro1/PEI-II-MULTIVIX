import TelegramBot from "node-telegram-bot-api";
import { env } from './env/environment.js';

export const instanciaTelegram = new TelegramBot(env.TELEGRAM_TOKEN, { polling: true });

const comandos = [
    { command: "cadastrar", description: "Se cadastra para receber dados obtidos da transparência da prefeitura de Vila Velha - ES" },
    { command: "cancelar", description: "Deixa de receber notificações das atualizações da prefeitura" },
    { command: "atualizar", description: "Recebe a última atualização realizada pela prefeitura" }
]

export async function carregarComandosTelegram(){
    await instanciaTelegram.setMyCommands(comandos)
    await instanciaTelegram.getMyCommands();
}
instanciaTelegram.on('message', (mensagem) => {
    let chatId = mensagem.chat.id;
    if (mensagem.chat.type == 'private') {
        switch (mensagem.text.toLocaleLowerCase()) {
            case '/cadastrar':
                instanciaTelegram.sendMessage(chatId, "Você foi cadastrado para receber atualizações");
                break
            case '/cancelar':
                instanciaTelegram.sendMessage(chatId, "Você cancelou o recebimento de atualizações");
                break;
            case '/atualizar':
                instanciaTelegram.sendMessage(chatId, "*Última atualização emitida pela prefeitura*");
                break
            case '/ajuda':
                instanciaTelegram.sendMessage(chatId, "**Lista de Comandos** \n/cadastrar -> Cadastra a sua conta para receber atualizações\n/cancelar -> Cancela o recebimento de novas atualizações da prefeitura\n/atualizar -> Recebe a última atualização inserida no site da prefeitura");
                break
            default:
                instanciaTelegram.sendMessage(chatId, "Comando não identificado, digite /ajuda para checar os comandos disponíveis");
                break
        }
    }
})