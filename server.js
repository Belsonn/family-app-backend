const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const socket = require("socket.io");
const chatController = require("./controllers/chatController");

process.on("uncaughtException", (err) => {
  console.log("Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection successful!"))
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
const io = socket(server, {
  cors: {
    origin: "*",
  },
});
app.io = io;

io.on("connection", (socket) => {
  console.log("Socket connected");
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
