export const prefeituraController = {
    buscarAtualizacao: async () => {
        await fetch('https://wstransparencia.serra.es.gov.br/api/emenda')
            .catch(error => { console.log(error) })
            .then(async dados => {
                console.log("==========DADOS DA API CONSUMIDA===============")
                console.log(await dados.json())
            })
    }
}