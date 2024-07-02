import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "@routes/auth";
import userRoutes from "@routes/user";
import workerRoutes from "@routes/worker";
import serviceRoutes from "@routes/service";
import appointmentRoutes from "@routes/appointment";
import scheduleRoutes from "@routes/schedule";
const app = express();
const PORT = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/schedules", scheduleRoutes);

//server
app.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
