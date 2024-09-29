import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';

async function buscarDados() {
    const agent = new HttpsProxyAgent('http://189.113.117.135:8080')
    const options = {
        agent,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.5',
            'Referer': 'https://www.globo.com.br',
            'Connection': 'keep-alive'
        }
    };
    return new Promise((resolve, reject) => {
        console.log('entrei promise')
        https.get(`https://wstransparencia.serra.es.gov.br/api/emenda`, options, (res) => {
            let data = '';
            res.on('data', (body) => {
                data = body;
            })
            res.on('end', () => {
                resolve(data);
            });

        }).on('error', (err) => {
            reject(err);
        })
    })

}

export const prefeituraController = {
    buscarAtualizacao: async () => {
        return await buscarDados()
    }
}