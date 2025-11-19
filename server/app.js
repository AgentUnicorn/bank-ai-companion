import "./load-env.js"
import express from 'express';
import cors from 'cors';

import openaiRouter from './routes/openai.js'
import sessionRouter from './routes/session.js';
import bankingMcp from './routes/banking-mcp.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/session", sessionRouter)
app.use("/api/banking-mcp", bankingMcp)
app.use("/api/openai", openaiRouter)

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});