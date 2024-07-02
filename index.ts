import prisma from "@lib/prisma";
import express from "express";
const app = express();
const PORT = process.env.PORT || 8080;
const connect = async () => {
  try {
    await prisma
      .$connect()
      .then(() => {
        console.log("Database connected");
      })
      .catch((error) => {
        console.log("Database connection failed", error);
      });
  } catch (error) {
    throw error;
  }
};
app.listen(PORT, () => {
  connect();
  console.log("Server is running on port 8080");
});
