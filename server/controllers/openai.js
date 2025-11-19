import {OpenAI} from "openai";

export async function createOpenAIResponse(req, res, next)  {
    const body = req.body
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

    if (body.text?.format?.type === 'json_schema') {
        return await structuredResponse(res, openai, body)
    } else {
        return await textResponse(res, openai, body)
    }
}

async function structuredResponse(res, openai, body) {
    try {
        const response = await openai.responses.parse({
                ...body,
            stream: false,
            });

        return res.json(response);
    } catch (err) {
        console.error('responses proxy error', err);
        return res.json({ error: 'failed' }, { status: 500 });
    }
}

async function textResponse(res, openai, body) {
    try {
        const response = await openai.responses.create({
                ...body,
            stream: false,
            });

        return res.json(response);
    } catch (err) {
        console.error('responses proxy error', err);
        return res.json({ error: 'failed' }, { status: 500 });
    }
}

export default {
    createOpenAIResponse
}