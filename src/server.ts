import express from 'express';
import { json } from 'body-parser';
import verifyRoutes from './routes/verify.route';
import newsRoutes from './routes/news.route'
import imageUploadRoute from './routes/imageUpload.route'
import {prisma} from './db/prisma'
import cookieParser from 'cookie-parser';
import { metricsMiddleware } from "./metrics";
import { RequestHandler } from 'express';
import cors from 'cors';
import { imageUploadController } from './controllers/imageUpload.controller';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

app.use(json());
app.use(cookieParser()); // Add this line
app.use(metricsMiddleware as unknown as RequestHandler);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

//HEALTH TEST ROUTE 
app.get('/api/v1/health',(request,response)=>{
    return response.status(200).json({"message":"Punjab Click Tv Server"})
})

//DATABASE CONNECT VIA PRISMA ORM HEALTH CHECK ROUTE
app.get('/api/v1/test-db',async (request,response)=>{
    try {
        await prisma.$connect();
        response.json({ message: "Database connected successfully" });
    } catch (error) {
        
    }
})

//USEFUL ROUTES
app.use('/api/v1/verify',verifyRoutes)
app.use('/api/v1/news',newsRoutes)

//IMAGEKIT SIGNATURE ROUTE
app.use('/api/v1/imagekit-auth',imageUploadRoute)

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});