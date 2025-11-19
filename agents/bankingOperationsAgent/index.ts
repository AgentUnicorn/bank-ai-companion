import {RealtimeAgent} from "@openai/agents/realtime";
import {OPENAI_AGENT_VOICES} from "../voice.ts";
import {applyTemplate, template} from "../template.ts";
import {users} from "../../data/users.ts";
import {instructions} from "./instruction2.ts";
import {
    addSavedAccountTool,
    getAccountInfoTool,
    getTransactionsTool,
    listSavedAccountTool,
    confirmTransferMoney,
} from "./tools.ts";

const user = users[0]
const systemPrompt = template + instructions
const finalInstructions = applyTemplate(systemPrompt, user)

export const bankOperationsAgent = new RealtimeAgent({
    name: 'Bank Operations Agent',
    voice: OPENAI_AGENT_VOICES.SAGE,
    instructions: finalInstructions,
    tools: [
        getAccountInfoTool,
        getTransactionsTool,
        listSavedAccountTool,
        addSavedAccountTool,
        confirmTransferMoney,
    ],
    handoffs: []
})