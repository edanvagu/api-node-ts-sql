import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes/index";
import { db } from "./database/database";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

db();