import { tool } from '@openai/agents/realtime'

export const make_a_reservation = tool({
    name: "make_a_reservation",
    description: "Tạo đặt chỗ nhà hàng và trả về chuỗi thông báo bằng tiếng Việt xác nhận đã đặt chỗ thành công.",
    parameters: {
        type: "object",
        properties: {
            fullName: { type: "string", description: "Họ và tên khách" },
            phone: { type: "string", description: "Số điện thoại liên hệ" },
            restaurant: { type: "string", description: "Tên nhà hàng" },
            partySize: { type: "integer", minimum: 1, description: "Số người tham dự" },
            datetime: { type: "string", description: "Ngày giờ tham dự (ISO-8601 preferred, ví dụ: 2025-11-21T19:00:00)" }
        },
        required: ["fullName", "phone", "cardLast4", "restaurant", "partySize", "datetime"],
        additionalProperties: false
    },

    execute: async ({ fullName, phone, restaurant, partySize, datetime }) => {

        // Parse datetime
        const dateObj = new Date(datetime);
        if (isNaN(dateObj.getTime())) {
            return "❌ Ngày giờ không hợp lệ. Vui lòng dùng ISO format như 2025-11-21T19:00:00";
        }

        // Format time dd/mm/yyyy hh:mm
        const pad = (n: number) => String(n).padStart(2, "0");
        const formatted = `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;

        return {
            "success": true,
            "ui": {
                "type": "reservation_card",
                "data": {
                    "fullName": fullName,
                    "phone": phone,
                    "restaurant": restaurant,
                    "partySize": partySize,
                    "datetime": formatted,
                }
            }
        };
    }
});
