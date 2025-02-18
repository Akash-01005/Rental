import dotenv from "dotenv"
import express from 'express'
import http from 'http'
import DB  from './src/libs/DB.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes  from './src/routes/user.routes.js'
import propertyRoutes from './src/routes/property.routes.js'
import bookingRoutes from './src/routes/booking.routes.js'
import { initSocket  } from "./src/libs/socket.js"
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

dotenv.config();

const app = express();
const server = http.createServer(app);

DB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory in client/public if it doesn't exist
const uploadPath = path.join(__dirname, '../client/public/uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// No need to serve static files since they'll be in client/public

app.use(express.json());
app.use(cors({
    origin:[process.env.CORS_ORIGIN],
    credentials:true
}))
app.use(cookieParser());

server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

app.use("/api/auth",userRoutes)
app.use("/api/properties",propertyRoutes)
app.use("/api/bookings",bookingRoutes)

initSocket(server);

