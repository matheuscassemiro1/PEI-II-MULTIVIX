import TelegramBot from "node-telegram-bot-api";
import { env } from './env/environment.js';
import { usuarioController } from "./controller/usersController.js";
import { realizarMigrations } from "./database.js";
import { prefeituraController } from "./controller/prefeituraController.js";
import { consultaController } from "./controller/consultsController.js";
export const instanciaTelegram = new TelegramBot(env.TELEGRAM_TOKEN, { polling: true });

const comandos = [
    { command: "cadastrar", description: "Se cadastra para receber dados obtidos da transparência da prefeitura de Vila Velha - ES" },
    { command: "cancelar", description: "Deixa de receber notificações das atualizações da prefeitura" },
    { command: "atualizar", description: "Recebe a última atualização realizada pela prefeitura" }
]

export async function carregarComandosTelegram() {
    try {
        await instanciaTelegram.setMyCommands(comandos);
        await instanciaTelegram.getMyCommands();
        console.log("Comandos carregados com sucesso.")
    } catch {
        throw new Error("Falha ao cadastrar comandos.")
    }
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
        case '/preencher':
            try {
                await primeiroCadastroBanco();
                instanciaTelegram.sendMessage(chatId, "O banco foi preenchido com os dados do endpoint de emendas da Prefeitura da Serra.")
            } catch (error) {
                console.log(error)
                instanciaTelegram.sendMessage(chatId, "Ocorreu um erro ao preencher o banco")
            }
            break;
        default:
            instanciaTelegram.sendMessage(chatId, "Comando não identificado, digite /ajuda para checar os comandos disponíveis");
            break
    }

})

async function primeiroCadastroBanco() {
    try {
        const attPrefeitura = await prefeituraController.buscarAtualizacao();
        attPrefeitura.forEach(async dado => {
            if (!await consultaController.checarConsulta(dado)) {
                consultaController.cadastrarConsulta(dado);
                console.log(`Nova consulta adicionada ao banco. Número: ${dado}`)
            }
        })
    } catch (error) {
        console.log("Erro ao preencher o banco")
        console.log(error)
    }
}

export async function dispararNotificacaoUsuariosAtivos() {
    const usersAtivos = await usuarioController.listarUsuariosAtivos();
    try {
        const attPrefeitura = await prefeituraController.buscarAtualizacao();
        usersAtivos.forEach(async user => {
            try {
                const buscaDados = JSON.parse(attPrefeitura);
                const consultas = await consultaController.listarConsultas();
                buscaDados.forEach(retorno => {
                    if (!consultas.find(elemento => retorno.numero == elemento.numero)) {
                        console.log("entrei no foreach de não encontrado")
                        setTimeout(() => {
                            instanciaTelegram.sendMessage(user.chatId, `*Nova atualização obtida da Prefeitura da Serra!*\n*N°:* ${retorno.numero}\nPartido: ${retorno.partido}\nParlamentar: ${retorno.Parlamentar}\n*Data:* ${retorno.data}\n*Destino:* ${retorno.destino}\n*Valor:* ${retorno.valor}\n*Situação:* ${retorno.Situacao}\n*Descrição:*\n${retorno.descricao}`, { parse_mode: 'Markdown' });
                            console.log(`Atualização diária enviada enviada para o usuário. ChatID ${user.chatId} | Nome: ${user.nome}`);
                        }, 1000)
                    }
                })
                setTimeout(() => {
                    instanciaTelegram.sendMessage(user.chatId, `Não possuimos atualizações da Prefeitura, *${user.nome}*! Nossas atualizações são feitas às 11h e 17h de todos os dias.`, { parse_mode: 'Markdown' })
                }, 1000)
                console.log(`Mensagem disparada para ${user.nome}`)
            } catch (error) {
                console.log(`Erro ao disparar para ${user.nome}`)
                console.log(error)
                setTimeout(() => {
                    instanciaTelegram.sendMessage(user.chatId, `*Ops... Ocorreu um erro ao realizar a notificação diária*`, { parse_mode: 'Markdown' })
                }, 1000)
            }
        })
        attPrefeitura.forEach(async dado => {
            if (!await consultaController.checarConsulta(dado)) {
                consultaController.cadastrarConsulta(dado);
                console.log(`Nova consulta adicionada ao banco. Número: ${dado}`)
            }
        })
    } catch (e) {
        usersAtivos.forEach(async user => {
            setTimeout(() => { instanciaTelegram.sendMessage(user.chatId, `Não possuimos atualizações da Prefeitura, *${user.nome}*! Nossas atualizações são feitas às 11h e 17h de todos os dias.`, { parse_mode: 'Markdown' }) }, 1000)
        })
        console.log(e)
        console.log("Erro ao realizar a consulta diária.")
    }

}