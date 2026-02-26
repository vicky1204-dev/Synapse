import app from "./app.js"
import dotenv from "dotenv"
import { connectDb } from "./config/db.js";

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3000;

connectDb()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});