import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AuthController = {
  // CADASTRO
  async register(req, res) {
    try {
      const { nome, email, password, confirm_password } = req.body;

      if (!nome || !email || !password || !confirm_password) {
        return res.status(400).json({ error: "Preencha todos os campos." });
      }

      if (password != confirm_password) {
        return res.status(400).json({ error: "As senhas devem ser iguais." });
      }

      /* VALIDAÇÃO DA SENHA */
      const passwordErrorMessage = () => {
        return res.status(400).json({
          error:
            "A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.",
        });
      };

      const hasMinLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

      if (
        !hasMinLength ||
        !hasUppercase ||
        !hasLowercase ||
        !hasNumber ||
        !hasSpecialChar
      ) {
        return passwordErrorMessage();
      }

      // 1. Verifica se o e-mail já existe
      const userExists = await User.findByEmail(email);
      if (userExists) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }

      // 2. Criptografa a senha (10 rounds de salt)
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(password, salt);

      // 3. Salva no banco
      const formattedEmail = email.toLowerCase();
      const newUser = await User.create({
        nome,
        email: formattedEmail,
        password: senhaHash,
      });

      return res.status(201).json({
        message: "Usuário cadastrado com sucesso!",
        user: newUser,
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  },

  // LOGIN
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Informe e-mail e senha." });
      }

      // 1. Busca o usuário
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
      }

      // 2. Compara a senha enviada com o hash salvo
      const passwordMatch = await bcrypt.compare(password, user.senha);
      if (!passwordMatch) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
      }

      // 3. Gera o token JWT (válido por 1 dia)
      const token = jwt.sign(
        { id: user.id, nome: user.nome, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
        httpOnly: true, // Impede leitura via JS (document.cookie)
        secure: isProduction, // Apenas HTTPS em produção
        sameSite: isProduction ? "none" : "lax", // Proteção contra CSRF ('strict' ou 'lax')
        maxAge: 1000 * 60 * 60, // 1 hora em milissegundos
      });

      return res.json({
        message: "Login realizado com sucesso!",
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  },

  async logout(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({ message: "Logout realizado com sucesso." });
    } catch (error) {
      console.error("Erro no logout:", error);
      return res.status(500).json({ error: "Erro interno ao deslogar." });
    }
  },

  async me(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Não autenticado" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return res.json({
        user: {
          id: decoded.id,
          email: decoded.email,
          nome: decoded.nome,
        },
      });
    } catch (error) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
  },
};

export default AuthController;
