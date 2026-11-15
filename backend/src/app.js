import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const production = process.env.NODE_ENV === "production";
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGODB_URI || (production ? "" : "mongodb://127.0.0.1:27018/zoom");

connectToSocket(server);
if (!production) app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.get("/healthz", (req, res) => res.sendStatus(mongoose.connection.readyState === 1 ? 200 : 503));
app.use("/api/v1/users", userRoutes);
app.use("/api", (req, res) => res.sendStatus(404));

if (production) {
    const web = fileURLToPath(new URL("../../frontend/build", import.meta.url));
    app.use(express.static(web));
    app.get("*", (req, res) => res.sendFile(path.join(web, "index.html")));
}

try {
    if (!mongoURI) throw new Error("MONGODB_URI is required.");
    await mongoose.connect(mongoURI);
    server.listen(port, () => console.log(`Zoom is running on port ${port}`));
} catch (error) {
    console.error("Unable to connect to MongoDB:", error.name);
    process.exitCode = 1;
}
