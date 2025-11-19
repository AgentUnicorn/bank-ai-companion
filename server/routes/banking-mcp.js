import express from 'express';
import banking from '../clients/banking.js';
const router = express.Router()

router.post('/call', async (req, res) => {
    try {
        const toolName = req.body.toolName || ''
        const args = (req.body?.args ?? {})

        if (typeof toolName !== 'string' || toolName.length === 0) {
            return res.status(400).json(
                { error: 'toolName phải là chuỗi hợp lệ.' },
            );
        }

        const content = await banking.callBankingMcpTool(toolName, args);
        return res.status(200).json({ content });
    } catch (error) {
        console.error('[bank-mcp call] Lỗi:', error);
        return res.status(500).json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Không xác định được lỗi khi gọi MCP tool.',
            },
        );
    }
})

export default router