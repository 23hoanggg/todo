import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.route.js";
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
