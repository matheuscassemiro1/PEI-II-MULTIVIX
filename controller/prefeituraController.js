export const prefeituraController = {
    buscarAtualizacao: async () => {
        return await fetch('https://wstransparencia.serra.es.gov.br/api/emenda')
            .catch(error => {
                throw new Error(error)
            })
            .then(async dados => {
                const aux = await dados.json();
                return aux;
            })
    }
}