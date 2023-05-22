import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import UserController from "./controller/User.controller";
import BattleController from "./controller/Battle.controller";
import NftController from "./controller/Nft.controller";
import IndexController from "./controller/index.controller";
import LeaderController from "./controller/Leaderboard.controller";
import { CronJobRootFunction } from "./partials/Cronjobs/index.cronjob";
import { EndBattle } from "./partials/Battle/End.battle";

import { EndBattleCronJob } from "./partials/Cronjobs/EndBattle.cronjob";

import { TestFunction } from "./partials/TestFunction";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

dotenv.config();
const app = express();

const port = Number(process.env.PORT) || 3003;
let frontendUrl = process.env.FrontendUrl || "";
let adminPanelUrl = process.env.AdminUrl || "";

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [frontendUrl, adminPanelUrl],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//routes middleware
app.use("/", IndexController);
app.use("/api/user", UserController);
app.use("/api/battle", BattleController);
app.use("/api/nft", NftController);
app.use("/api/leaderboard", LeaderController);

//cront job function
CronJobRootFunction();
EndBattleCronJob();

EndBattle("HEALTH");

TestFunction();

let date: any = new Date("2023-05-14T20:00:00.000+00:00");

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
