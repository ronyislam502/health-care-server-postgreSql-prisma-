import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//parser
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Health-Care server",
  });
});

app.use("/api/v1", router);

export default app;
