import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cores from 'cors'
import  config  from "config";
import logger from "./utilis/logger"
import {version} from "../package.json"
import socket from "./socket";
const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors:{
        origin:corsOrigin,
        credentials: true
    }
});

app.get("/", (_,res)=> res.send(`Server is up and running version ${version}`)) 
httpServer.listen(port,host, ()=> {
    logger.info(`Server version ${version} is up`)
    logger.info(`http://${host}:${port}`)
    socket({io})
})