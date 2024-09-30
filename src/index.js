import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

// console.log(process.env);
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, (req, res) => {
      console.log("App is running on port: ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection failed!!! ", err);
  });
