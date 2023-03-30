const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user-routes");
const betRouter = require("./routes/bet-routes");
const app = express();

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use("/users", userRouter);
app.use("/bets", betRouter);


mongoose
  .connect("mongodb+srv://admin:A5ZkdIWoP0yKlfx0@cluster0.csu7sgp.mongodb.net/?retryWrites=true&w=majority")

  .then(() =>
    app.listen(9000, () => console.log("Connected and listening on 9000 "))
  )
  .catch((err) => console.log(err));