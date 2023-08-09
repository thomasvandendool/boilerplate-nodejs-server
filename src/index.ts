// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import express, { Request, Response, Express } from 'express';
import { authenticationRequired } from './middleware/auth';
import { WebTokenRequest } from './types';
import { errorMiddleware } from './middleware/error-middleware';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit'
import { migrateToLatest } from './db/migrator';

migrateToLatest();

const app: Express = express();
const port = process.env.PORT ?? 8080;

const origins = process.env.WHITELISTED_ORIGINS;
const origin = origins
    ? origins.split(",").map((orgn) => orgn.trim())
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
    cors({
        origin,
        credentials: true,
    })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("⚡️[server]: :method :url :status"));

app.all('*', authenticationRequired);

app.get('/api/whoami', (req, res) => {
    res.json((req as WebTokenRequest).jwt?.claims);
});

app.use('*', (_: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use(errorMiddleware);

app.listen(8080, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
});

