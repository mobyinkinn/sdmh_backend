import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = e();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(e.json({ limit: "16kb" }));
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
import awardsRouter from "./routes/award.route.js";
import enquiryRouter from "./routes/enquiry.route.js";
import contactRouter from "./routes/contact.route.js";
import videoRouter from "./routes/video.route.js";
import openingRouter from "./routes/opening.route.js";
import careerRouter from "./routes/career.route.js";
import tipsRouter from "./routes/tips.route.js";
import testimonialRouter from "./routes/testimonial.route.js";
import checkupRouter from "./routes/checkup.route.js";
import bannerRouter from "./routes/banner.route.js";
import blogsRouter from "./routes/blogs.route.js";
//routes declaration
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/academics", academicsRouter);
app.use("/api/v1/tpa", tpaRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/blogs", blogsRouter);
app.use("/api/v1/downloadables", downloadableRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/awards", awardsRouter);
app.use("/api/v1/enquiry", enquiryRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/openings", openingRouter);
app.use("/api/v1/careers", careerRouter);
app.use("/api/v1/tips", tipsRouter);
app.use("/api/v1/testimonials", testimonialRouter);
app.use("/api/v1/checkup", checkupRouter);
app.use("/api/v1/banner", bannerRouter);

export default app;
