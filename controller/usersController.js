import { database } from "../database.js";

export const usuarioController = {
    criarUsuario: async (nome, numero) => {
        database
            .insert({ nome: nome, numero: numero, ativo: 1 })
            .from("usuarios")
            .catch(error => { console.error(error.sqlMessage) })
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
    inativarUsuario: async (numero) => {
        database
            .update({ ativo: 0 })
            .from('usuarios')
            .where({ numero: numero })
            .catch(error => { throw new Error(error) })
            .then(dados => {
                return dados
            })
    }

}
