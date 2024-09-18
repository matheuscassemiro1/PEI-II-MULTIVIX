import express from 'express';
import { usuarioController } from '../controller/usersController.js';


export const apiRouter = express();

apiRouter.get("/", async (req, res, next) => {
    let aux = await usuarioController.listarUsuariosAtivos()
    res.send(aux)
})


apiRouter.post("/hook", async (req, res, next) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    ///req.body.entry[0].changes[0].value.message_echoes  ---> dados recebidos do webhook echoes
    res.sendStatus(200);
})

apiRouter.post("/users", async (req, res, next) => {
    let aux = await usuarioController.criarUsuario(req.body.nome, req.body.numero)
    res.send({ status: aux, mensagem: "cadastrado" })
})
