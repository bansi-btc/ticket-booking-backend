import express, { Request, Response } from "express";
import userRouter from "./routes/user.route";
import { client } from "./client";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes

app.use("/api/v1/users", userRouter);

app.get("/api/v1/users", async (req: Request, res: Response) => {
  const users = await client.user.findMany();
  res.json(users);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
