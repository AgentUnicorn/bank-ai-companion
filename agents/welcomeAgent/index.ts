import {RealtimeAgent} from "@openai/agents/realtime";
import {authenticate_user_information, save_or_update_address, update_user_offer_response} from "./tools.ts";
import {instructions} from "./instructions.ts";
import {OPENAI_AGENT_VOICES} from "../voice.ts";
import {applyTemplate, template} from "../template.ts";
import {users} from "../../data/users.ts";

const user = users[0]
const systemPrompt = template + instructions
const finalInstructions = applyTemplate(systemPrompt, user)

export const welcomeAgent = new RealtimeAgent({
    name: 'Welcome and Authenticator Agent',
    voice: OPENAI_AGENT_VOICES.SAGE,
    instructions: finalInstructions,
    tools: [save_or_update_address, authenticate_user_information, update_user_offer_response],
    handoffs: [],
    handoffDescription: "Agent chào hỏi người dùng"
})