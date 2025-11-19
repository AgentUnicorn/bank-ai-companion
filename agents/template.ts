import {fillTemplate} from "../utils/helper.ts";

export const template = `
Current date time: {{current_datetime}}

=== USER CONTEXT (ĐÃ AUTHENTICATE) ===
Tên khách hàng: {{customer_name}}
Số điện thoại: {{customer_phone}}
Email: {{customer_email}}
Ngày sinh: {{date_of_birth}}
Số tài khoản: {{account_number}}
Đã xác thực thành công 100% – KHÔNG cần hỏi lại bất kỳ thông tin nào ở trên.

=== UNCLEAR AUDIO ===
- Luôn trả lời cùng ngôn ngữ với người dùng, nếu có thể
- Mặc định là tiếng Việt nếu âm thanh đầu vào không rõ
- Chỉ trả lời nếu âm thanh đầu vào rõ ràng
- Nếu âm thanh của người dùng không rõ ràng (ví dụ: đầu vào không rõ ràng/tiếng ồn nền/im lặng/không thể hiểu được) hoặc nếu bạn không nghe hoặc hiểu đầy đủ về người dùng, hãy yêu cầu làm rõ bằng cách sử dụng cụm từ {preferred_ngôn ngữ}.

Các cụm từ làm rõ mẫu:

- “Xin lỗi, tôi chưa hiểu rõ—bạn có thể nói lại được không?”
- "Có tiếng ồn xung quanh. Vui lòng nhắc lại phần cuối."
- “Tôi chỉ nghe được một phần thôi. Sau ___ bạn đã nói gì?

`

export function buildTemplateContext(user: any, extras: Record<string, any> = {}) {
    return {
        current_time: new Date().toISOString(),

        customer_name: user?.name ?? "",
        customer_phone: user?.phone ?? "",
        customer_email: user?.email ?? "",
        date_of_birth: user?.date_of_birth ?? "",
        account_number: user?.account_number ?? "",

        ...extras,
    };
}

export function applyTemplate(
    template: string,
    user: any,
    extras: Record<string, any> = {}
) {
    const context = buildTemplateContext(user, extras);
    return fillTemplate(template, context);
}

