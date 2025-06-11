import express from "express";
import { Server } from "http";
import app from "./app";

const port = 3000;

let server: Server;

const main = async () => {
  try {
    server = app.listen(port, () => {
      console.log(`Health-Care listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();

process.on("unhandledRejection", () => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
