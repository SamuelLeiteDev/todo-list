import "dotenv/config";
import express from "express";
import cors from "cors";

// Inicializa a conexão com o banco
import db from "./config/db.js";

// Importa as rotas de autenticação
import authRoutes from "./routes/authRoutes.js";
import tasksRoutes from "./routes/tasks.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como Postman/mobile) ou se estiver na lista
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Não permitido pelo CORS"));
    },
    credentials: true,
  }),
);

// Registra as rotas
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

// Rota de teste
app.get("/health", (req, res) => {
  return res.json({ status: "ok", message: "API funcionando" });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
