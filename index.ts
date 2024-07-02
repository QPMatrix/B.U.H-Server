import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "@routes/auth";
const app = express();
const PORT = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
