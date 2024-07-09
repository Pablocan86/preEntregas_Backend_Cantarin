const express = require("express");
const userModel = require("../../dao/models/users.model.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const sessionController = require("../../controllers/sessionController.js");
const {
  generateToken,
  authToken,
  passportCall,
  authorization,
} = require("../../utils.js");
const router = express.Router();

const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret";
const users = [];

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "failregister",
  }),
  sessionController.register
);

router.get("/failregister", async (req, res) => {
  console.log("Estrategia fallida");
  res.send({ error: "Falló" });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "faillogin" }),
  sessionController.login
);

router.get("/current", sessionController.current);

router.get("/faillogin", (req, res) => {
  res.render("login", {
    style: "login.css",
    title: "Bienvenido",
    Error: "Usuario y/o contraseña incorrectos",
  });
});

router.post("/logout", sessionController.logout);

router.get("/auth/google", passport.authenticate("google", { scope: "email" }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "login" }),
  sessionController.googleCallback
);

router.get(
  "/github",
  passport.authenticate("github", { scope: "user.email" }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "login" }),
  sessionController.githubCallback
);
module.exports = router;
