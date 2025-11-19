import express from 'express';
import responsesController from '../controllers/openai.js'
const router = express.Router()

router.post('/response', responsesController.createOpenAIResponse)

export default router