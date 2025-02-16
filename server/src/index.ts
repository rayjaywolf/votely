import express from "express";
import cors from "cors";
import { pollRoutes } from "./routes/polls";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/polls", pollRoutes);

app.get("/api/health", (_, res) => {
  res.json({ status: "healthy" });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  }
);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
