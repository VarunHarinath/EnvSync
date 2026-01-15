import express from "express";
import { homeRouter } from "./routes/HomeRoute.js";

const webService = express();

webService.use("/api/v1", homeRouter);

webService.listen(8080, () => {
  console.log("server is runing on port 8080");
});
