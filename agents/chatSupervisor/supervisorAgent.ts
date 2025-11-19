import { RealtimeItem, tool } from '@openai/agents/realtime';


import {
    exampleAccountInfo,
    examplePolicyDocs,
    exampleStoreLocations,
} from './sampleData';

export const supervisorAgentInstructions = `You are an expert customer service supervisor agent, tasked with providing real-time guidance to a more junior agent who's chatting directly with the customer. You will be given detailed response instructions, tools, and the full conversation history so far, and you should create a correct next message that the junior agent can read directly.

# Instructions
- You can provide an answer directly, or call a tool first and then answer the question.
- If you need to call a tool, but don't have the right information, you can tell the junior agent to ask for that information in your message.
- Your message will be read verbatim by the junior agent, so feel free to use it like you would talk directly to the user.

==== Domain-Specific Agent Instructions ====
You are a helpful customer service agent working for Nobinobi, helping a user efficiently fulfil their request while adhering closely to provided guidelines.

# Instructions
- Always greet the user at the start of the conversation with:  
  “Xin chào, bạn đang liên hệ Nobinobi, tôi có thể hỗ trợ bạn như thế nào?”  
- Always call a tool or lookup procedure before answering factual questions about the company, its offerings or products, or a user’s account. Only use retrieved context and never rely on your own memory for any of these questions.
- If the user requests escalation to a human colleague, you must comply and either handover or ask for relevant details to do so.
- Do not discuss prohibited topics (politics, religion, controversial current events, medical, legal or financial advice beyond standard consumer guidance, internal company operations, or criticism of any people or company).
- Use sample phrases when appropriate, but never repeat the exact same phrase in the same conversation. Vary wording so it sounds natural and friendly.
- Always follow the provided output format for new messages, including citations for any factual statements from retrieved policy or company documentations.

# Response Instructions
- Maintain a warm, professional and concise tone in all responses.
- Use clear, short sentences; avoid long lists of bullet-points unless strictly needed.
- If you have access to more information, summarise only the most relevant key points rather than fully exhaustive detail—unless user asks for depth.
- Do not speculate or make assumptions about capabilities or information. If a request cannot be fulfilled with available tools or information, politely refuse and offer to escalate to a human representative.
- If you do not have all required information to call a tool, you MUST ask the user for the missing information in your message. NEVER attempt to call a tool with missing or placeholder values.
- Do not offer or attempt to fulfil requests for capabilities or services not explicitly supported by your tools or provided information.
- Only offer to provide more information if you know for sure there is more information available to provide, based on the tools and context you have.
- When possible, please provide specific numbers or details to substantiate your answer—e.g., shipping time, return window, product guarantees.

# Sample Phrases  
## If you need to ask for more info  
- “Để hỗ trợ bạn tốt hơn, anh/chị vui lòng cung cấp thêm thông tin về [ví dụ: mã đơn hàng / mã sản phẩm / số điện thoại liên hệ] nhé.”  
- “Cho tôi xin thêm thông tin [ví dụ: ngày nhận hàng / tên sản phẩm] để tôi kiểm tra giúp bạn.”

## Deflecting a Prohibited Topic  
- “Xin lỗi, nhưng tôi không thể thảo luận chủ đề đó. Tuy nhiên, tôi rất sẵn lòng giúp bạn với các vấn đề khác liên quan tới Nobinobi nhé.”  
- “Tôi xin lỗi nhưng tôi không thể cung cấp thông tin về việc đó. Anh/chị muốn gặp nhân viên hỗ trợ trực tiếp không ạ?”

## Before calling a tool  
- “Tôi sẽ kiểm tra thông tin giúp bạn ngay bây giờ — xin chờ một lát nhé.”  
- “Để xác nhận giúp bạn, tôi sẽ truy cập hệ thống và thông báo kết quả ngay.”

# User Message Format
- Always include your final response to the user.
- When providing factual information from retrieved context, include citations for the source like: [DOCUMENT_NAME](ID).
- Only provide information about Nobinobi’s company, products, policies or the user’s account, and only if it is based on information provided in context. Do not answer beyond that scope.
`;

export const supervisorAgentTools = [
    {
        type: "function",
        name: "lookupPolicyDocument",
        description:
            "Tool to look up internal documents and policies by topic or keyword.",
        parameters: {
            type: "object",
            properties: {
                topic: {
                    type: "string",
                    description:
                        "The topic or keyword to search for in company policies or documents.",
                },
            },
            required: ["topic"],
            additionalProperties: false,
        },
    },
    {
        type: "function",
        name: "findNearestStore",
        description:
            "Tìm cửa hàng/điểm nhận hàng Nobinobi gần nhất dựa trên mã bưu chính (postal code) Việt Nam.",
        parameters: {
            type: "object",
            properties: {
                postal_code: {
                    type: "string",
                    description:
                        "Mã bưu chính 5 chữ số của Việt Nam (vd: '700000' cho khu vực trung tâm TP.HCM).",
                },
            },
            required: ["postal_code"],
            additionalProperties: false,
        },
    },
    {
        type: "function",
        name: "getUserAccountInfo",
        description:
            "Tool to get user account information. This only reads user accounts information, and doesn't provide the ability to modify or delete any values.",
        parameters: {
            type: "object",
            properties: {
                phone_number: {
                    type: "string",
                    description:
                        "Formatted as '(xxx) xxx-xxxx'. MUST be provided by the user, never a null or empty string.",
                },
            },
            required: ["phone_number"],
            additionalProperties: false,
        },
    },
    {
        type: "function",
        name: "findNearestStore",
        description:
            "Tool to find the nearest store location to a customer, given their zip code.",
        parameters: {
            type: "object",
            properties: {
                zip_code: {
                    type: "string",
                    description: "The customer's 5-digit zip code.",
                },
            },
            required: ["zip_code"],
            additionalProperties: false,
        },
    },
];

async function fetchResponsesMessage(body: any) {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const response = await fetch(serverUrl + '/api/openai/response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // Preserve the previous behaviour of forcing sequential tool calls.
        body: JSON.stringify({ ...body, parallel_tool_calls: false }),
    });

    if (!response.ok) {
        console.warn('Server returned an error:', response);
        return { error: 'Something went wrong.' };
    }

    const completion = await response.json();
    return completion;
}

function getToolResponse(fName: string) {
    switch (fName) {
        case "getUserAccountInfo":
            return exampleAccountInfo;
        case "lookupPolicyDocument":
            return examplePolicyDocs;
        case "findNearestStore":
            return exampleStoreLocations;
        default:
            return { result: true };
    }
}

/**
 * Iteratively handles function calls returned by the Responses API until the
 * supervisor produces a final textual answer. Returns that answer as a string.
 */
async function handleToolCalls(
    body: any,
    response: any,
    addBreadcrumb?: (title: string, data?: any) => void,
) {
    let currentResponse = response;

    while (true) {
        if (currentResponse?.error) {
            return { error: 'Something went wrong.' } as any;
        }

        const outputItems: any[] = currentResponse.output ?? [];

        // Gather all function calls in the output.
        const functionCalls = outputItems.filter((item) => item.type === 'function_call');

        if (functionCalls.length === 0) {
            // No more function calls – build and return the assistant's final message.
            const assistantMessages = outputItems.filter((item) => item.type === 'message');

            const finalText = assistantMessages
                .map((msg: any) => {
                    const contentArr = msg.content ?? [];
                    return contentArr
                        .filter((c: any) => c.type === 'output_text')
                        .map((c: any) => c.text)
                        .join('');
                })
                .join('\n');

            return finalText;
        }

        // For each function call returned by the supervisor model, execute it locally and append its
        // output to the request body as a `function_call_output` item.
        for (const toolCall of functionCalls) {
            const fName = toolCall.name;
            const args = JSON.parse(toolCall.arguments || '{}');
            const toolRes = getToolResponse(fName);

            // Since we're using a local function, we don't need to add our own breadcrumbs
            if (addBreadcrumb) {
                addBreadcrumb(`[supervisorAgent] function call: ${fName}`, args);
            }
            if (addBreadcrumb) {
                addBreadcrumb(`[supervisorAgent] function call result: ${fName}`, toolRes);
            }

            // Add function call and result to the request body to send back to realtime
            body.input.push(
                {
                    type: 'function_call',
                    call_id: toolCall.call_id,
                    name: toolCall.name,
                    arguments: toolCall.arguments,
                },
                {
                    type: 'function_call_output',
                    call_id: toolCall.call_id,
                    output: JSON.stringify(toolRes),
                },
            );
        }

        // Make the follow-up request including the tool outputs.
        currentResponse = await fetchResponsesMessage(body);
    }
}

export const getNextResponseFromSupervisor = tool({
    name: 'getNextResponseFromSupervisor',
    description:
        'Determines the next response whenever the agent faces a non-trivial decision, produced by a highly intelligent supervisor agent. Returns a message describing what to do next.',
    parameters: {
        type: 'object',
        properties: {
            relevantContextFromLastUserMessage: {
                type: 'string',
                description:
                    'Key information from the user described in their most recent message. This is critical to provide as the supervisor agent with full context as the last message might not be available. Okay to omit if the user message didn\'t add any new information.',
            },
        },
        required: ['relevantContextFromLastUserMessage'],
        additionalProperties: false,
    },
    execute: async (input, details) => {
        const { relevantContextFromLastUserMessage } = input as {
            relevantContextFromLastUserMessage: string;
        };

        const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
            | ((title: string, data?: any) => void)
            | undefined;

        const history: RealtimeItem[] = (details?.context as any)?.history ?? [];
        const filteredLogs = history.filter((log) => log.type === 'message');

        const body: any = {
            model: 'gpt-4.1',
            input: [
                {
                    type: 'message',
                    role: 'system',
                    content: supervisorAgentInstructions,
                },
                {
                    type: 'message',
                    role: 'user',
                    content: `==== Conversation History ====
          ${JSON.stringify(filteredLogs, null, 2)}
          
          ==== Relevant Context From Last User Message ===
          ${relevantContextFromLastUserMessage}
          `,
                },
            ],
            tools: supervisorAgentTools,
        };

        const response = await fetchResponsesMessage(body);
        if (response.error) {
            return { error: 'Something went wrong.' };
        }

        const finalText = await handleToolCalls(body, response, addBreadcrumb);
        if ((finalText as any)?.error) {
            return { error: 'Something went wrong.' };
        }

        return { nextResponse: finalText as string };
    },
});
