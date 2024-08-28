import { database } from "../database.js";

export const consultaController = {
    listarConsultas: async () => {
        return await database
            .select()
            .from("consultas")
            .catch(error => { console.log(error) })
            .then(dados => {
                return dados;
            })
    },
    cadastrarConsulta: async () => {
        return await database
            .insert({ numero: "213213213" })
            .from("consultas")
            .catch(error => { console.error(error) })
            .then(dados => {
                console.log("CONSULTA CADASTRADA")
                console.log(dados[0])
            })

    }
}