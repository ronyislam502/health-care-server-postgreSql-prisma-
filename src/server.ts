import express from "express";
import { Server } from "http";

const app = express();
const port = 3000

let server:Server;

const main=async()=>{
    try {
        server=app.listen(port, () => {
         console.log(`Health-Care listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}
