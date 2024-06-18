const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const pessoasRouter = require("./routes/pessoas");
const modalidadesRouter = require("./routes/modalidades");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1/FichaAfericao", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));
mongoose.connection.once("open", () => {
  console.log("Conexão ao MongoDB realizada com sucesso");
});

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes setup
app.use("/api", indexRouter);
app.use("/api/pessoas", pessoasRouter);
app.use("/api/modalidades", modalidadesRouter);

// Error handling
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    code: err.status,
    message: err.message,
  });
});

module.exports = app;
