import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = e();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(e.json({ limit: "16kb" }));
// app.use(e.json());
app.use(e.urlencoded({ extended: true, limit: "16kb" }));
app.use(e.static("public"));
app.use(cookieParser());

//routes import
import adminRouter from "./routes/admin.routes.js";
import departmentRouter from "./routes/department.route.js";
import doctorRouter from "./routes/doctor.route.js";
import academicsRouter from "./routes/academics.route.js";
import tpaRouter from "./routes/tpa.route.js";
import eventRouter from "./routes/events.route.js";
import downloadableRouter from "./routes/downloadables.route.js";
import noticeRouter from "./routes/notices.route.js";

//routes declaration
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/academics", academicsRouter);
app.use("/api/v1/tpa", tpaRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/downloadables", downloadableRouter);
app.use("/api/v1/notices", noticeRouter);

export default app;
