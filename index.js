import cron from 'node-cron';

import { carregarComandosTelegram, dispararNotificacaoUsuariosAtivos } from './botTelegram.js';

/// AGENDAMENTO DISPARA A CADA 6H
const tarefa = cron.schedule('0 11,17 * * *', async () => {
    console.log("Início da Tarefa Agendada")
    const hora = new Date().toTimeString()
    console.log(hora);
    await dispararNotificacaoUsuariosAtivos(hora);
    console.log("Fim da Tarefa Agendada");
});


try {
    await carregarComandosTelegram();
} catch (error) {
    console.warn(`Erro ao carregar comandos do bot -> ${error}`);
}

