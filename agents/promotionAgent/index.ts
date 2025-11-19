import {RealtimeAgent} from "@openai/agents/realtime";
import {encode} from '@toon-format/toon'
import {make_a_reservation} from "./tools.ts";
import {promotionsData} from "./promotions.ts";
import {instructions} from "./instructions.ts";
import {OPENAI_AGENT_VOICES} from "../voice.ts";
import {users} from "../../data/users.ts";
import {applyTemplate, template} from "../template.ts";

const user = users[0]
const systemPrompt = template + instructions
const promotionsDataTOON = encode(promotionsData);
const finalInstructions = applyTemplate(systemPrompt, user, {
    promotionsData: promotionsDataTOON,
})

export const promotionAgent = new RealtimeAgent({
    name: 'Promotion Agent',
    voice: OPENAI_AGENT_VOICES.SAGE,
    instructions: finalInstructions,
    tools: [make_a_reservation],
    handoffDescription: "Trợ lý AI chuyên tìm kiếm các ưu đãi và hoàn tiền",
    handoffs: []
})