import app from "./app.js"
import dotenv from "dotenv"
import { connectDb } from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSockets } from "./sockets/index.js";
import {setIO} from "./sockets/socket.instance.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3000;

connectDb()

const httpServer = createServer(app);

// 🔥 Attach Socket.IO to it
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN.split(","),
    credentials: true,
  },
});

// 🔥 Initialize socket logic
initSockets(io);

/* “How do I access io inside inngest?”
Answer: We export io globally. */
setIO(io)

// 🔥 Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});