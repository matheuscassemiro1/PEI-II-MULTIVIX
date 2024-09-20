import { database } from "../database.js";

export const consultaController = {
    listarConsultas: async () => {
        return await database
            .select()
            .from("consultas")
            .catch(error => { throw new Error(error) })
            .then(dados => {
                return dados;
            })
    },
    cadastrarConsulta: async (numero) => {
        return await database
            .insert({ numero: numero })
            .from("consultas")
            .catch(error => { throw new Error(error) })
            .then(dados => {
                if (dados[0]) {
                    console.log(`Consulta #${numero} cadastrada`)
                }
            })
    }
}