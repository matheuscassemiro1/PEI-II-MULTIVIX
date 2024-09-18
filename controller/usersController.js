import { database } from "../database.js";

export const usuarioController = {
    criarUsuario: async (nome, chatId) => {
        return database
            .insert({ nome: nome, chatId: chatId, ativo: 1 })
            .from("usuarios")
            .catch(error => {
                console.error(error)
                throw new Error(error)
            })
            .then(dados => {
                return dados
            })
    },
    listarUsuariosAtivos: async () => {
        return database
            .select()
            .from("usuarios")
            .where({ ativo: 1 })
            .catch(error => { throw new Error(error) })
            .then(dados => {
                return dados
            })
    },
    cancelarUsuario: async (chatId) => {
        database
            .delete()
            .from('usuarios')
            .where({ chatId: chatId })
            .catch(error => { throw new Error(error) })
            .then(dados => {
                return dados
            })
    }

}
