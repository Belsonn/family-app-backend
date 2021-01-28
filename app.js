const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/user.router");
const shoppingListRouter = require("./routes/shoppingList.router");
const familyRouter = require("./routes/family.router");
const familyUserRouter = require("./routes/familyUser.router");
const chatRouter = require("./routes/chat.router");
const eventRouter = require('./routes/event.router');
const taskRouter = require('./routes/task.router');
const rewardRouter = require('./routes/reward.router');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/photos/users", express.static(path.join("./photos/users")));

// CORS
app.use(cors());


app.use(morgan("dev"));

//ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/familyUser", familyUserRouter);
app.use("/api/v1/family", familyRouter);
app.use("/api/v1/shoppingLists", shoppingListRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/rewards", rewardRouter);


app.use(globalErrorHandler);


module.exports = app;
