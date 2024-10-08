import TelegramBot from "node-telegram-bot-api";
import { env } from './env/environment.js';
import { usuarioController } from "./controller/usersController.js";
import { realizarMigrations } from "./database.js";
import { prefeituraController } from "./controller/prefeituraController.js";
export const instanciaTelegram = new TelegramBot(env.TELEGRAM_TOKEN, { polling: true });

const comandos = [
    { command: "cadastrar", description: "Se cadastra para receber dados obtidos da transparência da prefeitura de Vila Velha - ES" },
    { command: "cancelar", description: "Deixa de receber notificações das atualizações da prefeitura" },
    { command: "atualizar", description: "Recebe a última atualização realizada pela prefeitura" }
]

export async function carregarComandosTelegram() {
    await instanciaTelegram.setMyCommands(comandos);
    await instanciaTelegram.getMyCommands();
}

instanciaTelegram.on('message', async (mensagem) => {
    let chatId = mensagem.chat.id;

    switch (mensagem.text.toLocaleLowerCase()) {
        case '/cadastrar':
            await usuarioController.criarUsuario(mensagem.chat.first_name, chatId)
                .catch((erro) => {
                    instanciaTelegram.sendMessage(chatId, "Você já está cadastrado para receber atualizações");
                })
                .then(resposta => {
                    if (resposta) {
                        instanciaTelegram.sendMessage(chatId, "Você foi cadastrado para receber atualizações");
                    }
                })
            break
        case '/cancelar':
            await usuarioController.cancelarUsuario(chatId)
                .catch(resposta => {
                    instanciaTelegram.sendMessage(chatId, "Ocorreu um erro ao cancelar, tente novamente");
                })
                .then(resposta => {
                    instanciaTelegram.sendMessage(chatId, "Você cancelou o recebimento de atualizações");
                })
            break;
        case '/atualizar':
            try {
                console.log("O comando /atualizar foi utilizado")
                instanciaTelegram.sendMessage(chatId, `*Um momento... Carregando dados*`)
                const resposta = await prefeituraController.buscarAtualizacao();
                const retorno = JSON.parse(resposta)[0];
                instanciaTelegram.sendMessage(chatId, `*Última atualização emitida pela prefeitura*\n*N°:* ${retorno.numero}\nPartido: ${retorno.partido}\nParlamentar: ${retorno.Parlamentar}\n*Data:* ${retorno.data}\n*Destino:* ${retorno.destino}\n*Valor:* ${retorno.valor}\n*Situação:* ${retorno.Situacao}\n*Descrição:*\n${retorno.descricao}`, { parse_mode: 'Markdown' });
                console.log(`Atualização enviada para o usuário solicitado. ChatID ${chatId} | Nome: ${mensagem.chat.first_name}`)
            } catch (error) {
                console.log('ERRO AO ENVIAR /ATUALZIAR')
                console.log(error)
                instanciaTelegram.sendMessage(chatId, `*Ops... Ocorreu um erro*`)
            }
            break
        case '/ajuda':
            instanciaTelegram.sendMessage(chatId, "**Lista de Comandos** \n/cadastrar -> Cadastra a sua conta para receber atualizações\n/cancelar -> Cancela o recebimento de novas atualizações da prefeitura\n/atualizar -> Recebe a última atualização inserida no site da prefeitura");
            break
        case '/listar':
            const usersAtivos = await usuarioController.listarUsuariosAtivos()
            console.log(usersAtivos)
            instanciaTelegram.sendMessage(chatId, `${usersAtivos.length} usuários cadastrados.`)
            break
        case '/migrations':
            await realizarMigrations();
            instanciaTelegram.sendMessage(chatId, "Migrations realizadas no banco.")
            break;
        default:
            instanciaTelegram.sendMessage(chatId, "Comando não identificado, digite /ajuda para checar os comandos disponíveis");
            break
    }

})

export async function dispararNotificacaoUsuariosAtivos(hora) {
    const usersAtivos = await usuarioController.listarUsuariosAtivos()
    usersAtivos.forEach(user => {
        try {
            instanciaTelegram.sendMessage(user.chatId, `Não possuimos atualizações da Prefeitura, *${user.nome}*! Nossas atualizações são feitas às 11h e 17h de todos os dias.`, { parse_mode: 'Markdown' })
            console.log(`Mensagem disparada para ${user.nome}`)
        } catch (error) {
            console.log(`Erro ao disparar para ${user.nome}`)
            console.log(error)
        }
    })
}