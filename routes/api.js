import express from 'express';
import { usuarioController } from '../controller/usersController.js';


export const apiRouter = express();

apiRouter.get("/", async (req, res, next) => {
    let aux = await usuarioController.listarUsuariosAtivos()
    res.send(aux)
})


