import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import {
    CallToolResultSchema,
    ListToolsResultSchema,
} from '@modelcontextprotocol/sdk/types.js';

const bankingMcpURL = process.env.BANKING_MCP_SERVER_URL
const token = process.env.BANKING_MCP_AUTH_TOKEN;

let bankingMCPClient = null

async function createClient() {
    if (!bankingMcpURL) {
        throw new Error(
            "[bankingMcpClient] BANKING_MCP_SERVER_URL chưa được cấu hình. Các API bank MCP sẽ không hoạt động."
        )
    }

    if (!token) {
        throw new Error("[bankingMcpClient] Token chưa setup")
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    const transport = new StreamableHTTPClientTransport(new URL(bankingMcpURL), {
        requestInit: {
            headers: headers
        }
    });

    const client = new Client({
        name: "Banking MCP",
        version: "1.0.0"
    });

    try {
        await client.connect(transport)
    } catch (error) {
        console.error(error)
    }
    const response = await client.request(
        { method: "tools/list" },
        ListToolsResultSchema
    );

    console.log(
        "\nConnected to server with tools:",
        response.tools.map((tool) => tool.name)
    );

    return {client, transport}
}

async function getClient() {
    if (!bankingMCPClient) {
        bankingMCPClient = await createClient();
    }
    return bankingMCPClient;
}

async function callBankingMcpTool(
    toolName,
    args,
) {
    const { client } = await getClient();
    const raw = await client.callTool({
        name: toolName,
        arguments: args,
    });
    return CallToolResultSchema.parse(raw).content;
}

export default { getClient, callBankingMcpTool };