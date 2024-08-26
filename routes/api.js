import express from 'express';

export const apiRouter = express();

apiRouter.get("/", (req, res, next) => {
    res.send("Olá!")
})
