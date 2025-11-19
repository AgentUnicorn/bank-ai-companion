import express from 'express';
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const apiKey = req.body.apiKey || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(400).json({ error: 'No API key provided' });
        }

        const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session: {
                    type: "realtime",
                    model: process.env.OPENAI_REALTIME_MODEL,
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API error:', errorText);
            return res.status(response.status).json({ error: 'Failed to create session' });
        }

        const data = await response.json();
        res.json({ ephemeralKey: data.value });
    } catch (error) {
        console.error('Error creating ephemeral key:', error);
        res.status(500).json({ error: error.message });
    }
})

export default router;