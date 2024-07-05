const express = require("express");
const userModel = require("../../dao/models/users.model.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const sessionConstroller = require("../../controllers/sessionController.js");
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
  sessionConstroller.register
);

router.get("/failregister", async (req, res) => {
  console.log("Estrategia fallida");
  res.send({ error: "Falló" });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "faillogin" }),
  sessionConstroller.login
);

router.get("/current", async (req, res) => {
  try {
    if (req.session.user) {
      res.render("profile", { user: req.session.user, style: "profile.css" });
    } else {
      res.send({ message: "No hay usuario inciado" });
    }
  } catch (error) {
    console.error("No se ha iniciado sesión", error);
  }
});

router.get("/faillogin", (req, res) => {
  res.render("login", {
    style: "login.css",
    title: "Bienvenido",
    Error: "Usuario y/o contraseña incorrectos",
  });
});

router.post("/logout", sessionConstroller.logout);

router.get("/auth/google", passport.authenticate("google", { scope: "email" }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "login" }),
  sessionConstroller.googleCallback
);

router.get(
  "/github",
  passport.authenticate("github", { scope: "user.email" }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "login" }),
  sessionConstroller.githubCallback
);
module.exports = router;
