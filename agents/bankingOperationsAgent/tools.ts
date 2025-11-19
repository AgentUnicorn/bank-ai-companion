import {tool} from "@openai/agents/realtime";
import {tryParseJson} from "../../utils/helper.ts";

const BANKING_MCP_PROXY_ENDPOINT = '/api/banking-mcp/call';
type BankingToolInput = Record<string, unknown>;

const getUICardTypeByToolName = (toolName: string) => {
    switch (toolName) {
        case 'get_account_info':
            return 'balance_card';
        case 'transfer_money':
            return 'transfer_success_card';
        default:
            return 'none';
    }
}

const normalizeInput = (input: unknown): BankingToolInput => {
    if (!input) {
        return {};
    }
    if (typeof input === 'string') {
        if (input.trim().length === 0) return {};
        try {
            return JSON.parse(input);
        } catch (error) {
            throw new Error(
                `Không thể parse tham số tool thành JSON hợp lệ: ${String(error)}`,
            );
        }
    }
    if (typeof input === 'object') {
        return input as BankingToolInput;
    }
    return {};
};

const invokeBankingTool = async (
    toolName: string,
    input: unknown,
): Promise<string> => {
    const payload = normalizeInput(input);

    const response = await fetch(import.meta.env.VITE_SERVER_URL + BANKING_MCP_PROXY_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            toolName,
            args: payload,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(
            `Gọi tool ${toolName} thất bại (${response.status}): ${text}`,
        );
    }

    const data = await response.json();
    const parsedData = tryParseJson(data.content[0].text) ?? data
    const result = {
        success: true,
        ui: {
            type: getUICardTypeByToolName(toolName),
            data: parsedData,
        }
    }
    return JSON.stringify(result);
};

const looseObjectSchema = (
    properties: Record<string, unknown>,
    required: string[] = [],
) => ({
    type: 'object' as const,
    properties,
    required,
    additionalProperties: true as const,
});


export const getAccountInfoTool = tool({
    name: 'get_account_info',
    description:
        "Truy xuất thông tin tài khoản ngân hàng hiện tại (số tài khoản, tên, số dư, loại tiền tệ).",
    parameters: looseObjectSchema({}),
    strict: false,
    execute: (input) => invokeBankingTool('get_account_info', input),
});

export const getTransactionsTool = tool({
    name: 'get_transactions',
    description:
        "Lấy danh sách giao dịch gần nhất. Cho phép truyền 'limit' để giới hạn số bản ghi.",
    parameters: looseObjectSchema({
        limit: {
            type: 'integer',
            description: 'Số lượng giao dịch cần lấy (mặc định 10).',
        },
    }),
    strict: false,
    execute: (input) => invokeBankingTool('get_transactions', input),
});

export const initTransferMoney = tool({
    name: 'init_transfer_money',
    description: "Bắt đầu chuyển tiền. Sử dụng điều này khi người dùng yêu cầu gửi tiền một cách rõ ràng. Ghi lại tên người nhận, số tiền và tùy chọn số tài khoản của người nhận và nội dung chuyển khoản.",
    parameters: {
        type: "object",
        properties: {
            to_account_name: {type: "string", description: "Họ và tên người nhận"},
            to_account_number: {type: "number", description: "Số tài khoản"},
            amount: {type: "number", description: "Số tiền"},
            description: {type: "string", description: "Nội dung chuyển khoản"}
        },
        required: ["to_account_name", "to_account_number", "amount"],
        additionalProperties: false
    },
    execute: () => {
        return {
            success: true
        }
    }
})

export const continueTransferMoney = tool({
    name: 'continue_transfer_money',
    description: "Confirms the initial transfer details and proceeds to the final confirmation screen. Use this after the user has reviewed the initial transfer details on the screen and said 'ok' or 'continue'.",
    parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false
    },
    execute: () => {
        return {
            success: true
        }
    }
});

export const confirmTransferMoney = tool({
    name: 'confirm_transfer_money',
    description:
        "Thực hiện chuyển tiền tới người nhận khác. Cần số tài khoản nhận, số tiền và mô tả giao dịch.",
    parameters: looseObjectSchema(
        {
            to_account_number: { type: 'integer' },
            amount: { type: 'number' },
            description: { type: 'string' },
        },
        ['to_account_number', 'amount', 'description'],
    ),
    strict: false,
    execute: (input) => invokeBankingTool('transfer_money', input),
});

export const finishTransferMoney = tool({
    name: 'finish_transfer_money',
    description: "Confirms the initial transfer details and proceeds to the final confirmation screen. Use this after the user has reviewed the initial transfer details on the screen and said 'ok' or 'continue'.",
    parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false
    },
    execute: () => {
        return {
            success: true
        }
    }
})

export const cancelTransferMoney = tool({
    name: 'cancel_transfer_money',
    description: "Hủy toàn bộ quá trình chuyển tiền",
    parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false
    },
    execute: () => {
        return {
            success: true
        }
    }
})

export const addSavedAccountTool = tool({
    name: 'add_saved_account',
    description:
        "Thêm người nhận mới vào danh sách đã lưu. Cần số tài khoản, tên và ngân hàng.",
    parameters: looseObjectSchema(
        {
            account_number: { type: 'integer' },
            account_name: { type: 'string' },
            bank_name: { type: 'string' },
        },
        ['account_number', 'account_name', 'bank_name'],
    ),
    strict: false,
    execute: (input) => invokeBankingTool('add_saved_account', input),
});

export const listSavedAccountTool = tool({
    name: 'list_saved_account',
    description:
        'Liệt kê danh sách người nhận đã lưu (số tài khoản, tên, ngân hàng).',
    parameters: looseObjectSchema({
        recipient_name: {
            type: 'string',
            description: 'Tên người nhận. Mặc định là rỗng thì sẽ trả về toàn bộ',
        },
    }),
    strict: false,
    execute: (input) => invokeBankingTool('list_saved_account', input),
});
