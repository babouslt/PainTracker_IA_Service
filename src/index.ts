import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import apiRouter from "./routes/index";
const cors = require("cors");

const app: Application = express();

mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}`
  )
  .then(() => {
    app.listen(process.env.PORT, () => {});
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use("/api/", apiRouter);

export default app;
