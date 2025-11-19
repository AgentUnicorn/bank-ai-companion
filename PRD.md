# PRD: Product Requirements Document - Trợ lý Ngân hàng AI

Tài liệu này vạch ra các yêu cầu sản phẩm cho Trợ lý Ngân hàng AI, một bản demo về một trợ lý cá nhân tinh vi được tích hợp vào một ứng dụng ngân hàng. Mục tiêu chính là giới thiệu một UI/UX chuyên nghiệp, tiện lợi, giảm thiểu các tương tác chạm thủ công bằng cách tận dụng một AI chủ động, ưu tiên giọng nói (voice-first).
Viết bằng tiếng Việt
## Các Nguyên tắc Cốt lõi

1.  Bảo mật là trên hết: AI có thể truy cập dữ liệu người dùng và chuẩn bị các hành động (như thanh toán hoặc chuyển khoản), nhưng TUYỆT ĐỐI KHÔNG BAO GIỜ thực hiện một giao dịch tài chính mà không có sự xác nhận cuối cùng, rõ ràng từ người dùng trong một giao diện người dùng chuyên dụng.
2.  Đơn giản trong Hội thoại: Mục đích chính của AI là đơn giản hóa các tác vụ ngân hàng phức tạp hoặc nhiều bước thành các cuộc hội thoại tự nhiên, đơn giản.
3.  Hỗ trợ Chủ động: AI không chỉ là một công cụ phản ứng. Nó nên phân tích dữ liệu người dùng (với sự cho phép) để cung cấp những hiểu biết, lời nhắc và đề xuất có giá trị và kịp thời.
4.  UI/UX Hiện đại & Chuyên nghiệp: Thiết kế trực quan phải truyền cảm hứng tự tin và mang lại cảm giác hiện đại, sạch sẽ và an toàn, ưu tiên giọng nói và giảm thiểu việc chạm vào màn hình.

---
## Template (Copy for new features)

### [Feature Name]
-  Trạng thái: `Backlog` | `Cần làm` | `Đang thực hiện` | `Đã xong`

#### 1. Product Brief & PRP (Phần của bạn)
*  Định nghĩa ý tưởng & Mục tiêu:
*  Giá trị cho người dùng (User Value):
*  Phác thảo chức năng & User Flow:
### 2. Feature Specifications
*  Phân tích & Kế hoạch:
*  Ghi chú triển khai:
- Feature ID/Key: `unique_feature_key`
- User Story: As a [user type], I want to [perform an action] so that I can [achieve a goal].
- UI/UX Description:
- A description of all visual elements, animations, transitions, and how the user interacts with them.
- Functional Requirements:
- A numbered list of specific, testable requirements (e.g., "The system MUST...").
- Flow & Logic:
- Flow Diagram (Text Representation): A text-based flowchart illustrating the primary user and data flow.
- Detailed Logic: A step-by-step description of the process from user input to system response.
- Dependencies:
- A list of other components, APIs, or data sources this feature relies on.
- Acceptance Criteria (for QA):
- A checklist of conditions to verify the feature is implemented correctly.

#### 3. Analysis & Implementation Plan (Phần của AI)
*  Phân tích & Kế hoạch:
*  Ghi chú triển khai:
---

### Tương tác bằng giọng nói (Voice Interaction)
-   **Trạng thái**: `Đã xong`

#### 1. Product Brief & PRP (Phần của bạn)
*   **Định nghĩa ý tưởng & Mục tiêu**:
    *   Mục tiêu là tạo ra một giao diện "voice-first" (ưu tiên giọng nói) cho phép người dùng thực hiện các tác vụ ngân hàng thông qua các cuộc hội thoại tự nhiên với trợ lý AI. Điều này nhằm giảm thiểu nhu cầu tương tác thủ công (chạm), giúp trải nghiệm nhanh hơn, tiện lợi hơn và dễ tiếp cận hơn.
*   **Giá trị cho người dùng (User Value)**:
    *   **Tiện lợi**: Thực hiện giao dịch nhanh chóng khi đang di chuyển hoặc bận tay.
    *   **Đơn giản hóa**: Biến các quy trình phức tạp (như chuyển tiền) thành một cuộc đối thoại đơn giản.
    *   **Dễ tiếp cận**: Giúp người dùng gặp khó khăn với giao diện cảm ứng truyền thống có thể sử dụng ứng dụng dễ dàng hơn.
*   **Phác thảo chức năng & User Flow**:
    1.  Người dùng nhấn nút micro để bắt đầu phiên tương tác.
    2.  Hệ thống kết nối với AI, trợ lý ảo chào người dùng.
    3.  Người dùng nói yêu cầu của mình (ví dụ: "Chuyển 20 đô la cho Châu").
    4.  AI xử lý yêu cầu, có thể hỏi thêm để làm rõ thông tin nếu cần.
    5.  AI sử dụng "Tool Calling" (gọi công cụ) để chuẩn bị các hành động trong giao diện người dùng (ví dụ: mở màn hình chuyển tiền và điền sẵn thông tin).
    6.  AI xác nhận bằng lời nói những gì nó đã làm ("Tôi đã điền thông tin chuyển tiền, bạn vui lòng kiểm tra trên màn hình").
    7.  Người dùng xác nhận hoặc tiếp tục tương tác bằng giọng nói.
    8.  Người dùng nhấn nút dừng hoặc kết thúc phiên hội thoại để quay lại trạng thái ban đầu.

#### 2. Feature Specifications
*   **Feature ID/Key**: `voice_interaction`
*   **User Story**: Là một người dùng bận rộn, tôi muốn có thể ra lệnh cho ứng dụng ngân hàng bằng giọng nói để thực hiện các giao dịch một cách nhanh chóng mà không cần phải gõ hay chạm nhiều lần.
*   **UI/UX Description**:
    *   Khi ở trạng thái chờ (idle), một nút micro lớn, rõ ràng được hiển thị.
    *   Khi người dùng nhấn nút, nút này chuyển thành biểu tượng "dừng" hoặc "tạm dừng" và có hiệu ứng động (ví dụ: vòng sóng lan tỏa) để cho biết hệ thống đang lắng nghe.
    *   Trạng thái của AI (Đang kết nối, Đang lắng nghe, Đang xử lý, Đang nói) được hiển thị rõ ràng bằng văn bản trên màn hình.
    *   Hình ảnh đại diện của AI (nhân vật G) có các hiệu ứng hình ảnh tinh tế tương ứng với trạng thái (ví dụ: hiệu ứng "thở" nhẹ khi chờ, hiệu ứng "phát sáng" khi nói).
    *   Cuộc hội thoại được hiển thị dưới dạng bong bóng chat, tương tự các ứng dụng nhắn tin. Bong bóng của người dùng hiển thị sóng âm khi đang nói.
*   **Functional Requirements**:
    1.  Hệ thống PHẢI sử dụng API Gemini Live để xử lý âm thanh theo thời gian thực với độ trễ thấp.
    2.  Hệ thống PHẢI có khả năng chuyển đổi giọng nói của người dùng thành văn bản (Speech-to-Text).
    3.  Hệ thống PHẢI có khả năng chuyển đổi văn bản phản hồi của AI thành giọng nói (Text-to-Speech).
    4.  Hệ thống PHẢI hiển thị bản ghi (transcription) của cuộc hội thoại trên giao diện.
    5.  Hệ thống PHẢI sử dụng `FunctionDeclaration` (Tool Calling) để kích hoạt các hành động trong ứng dụng (ví dụ: `transferMoney`, `viewTransactions`). AI không được phép tự thực hiện hành động.
    6.  Hệ thống PHẢI quản lý các trạng thái một cách rõ ràng: `IDLE`, `LISTENING`, `THINKING`, `SPEAKING`.
    7.  Người dùng PHẢI có khả năng ngắt lời AI bất cứ lúc nào.
*   **Flow & Logic**:
    *   **Flow Diagram (Text Representation)**:
        `User -> Nhấn nút Micro -> App State: THINKING (Connecting) -> Gemini Live Session: onopen -> AI Chào -> App State: LISTENING -> User Nói -> Gemini gửi Audio Stream -> AI Xử lý (có thể gọi Tool) -> AI phản hồi (Audio Stream + Transcription) -> App State: SPEAKING -> ... (lặp lại) -> User Nhấn nút Dừng -> Session Close -> App State: IDLE`
    *   **Detailed Logic**:
        1.  Khi `handleVoiceToggle` được gọi, `useLiveSession.start()` được kích hoạt.
        2.  Trạng thái ứng dụng chuyển sang `THINKING`.
        3.  `ai.live.connect` được gọi để thiết lập kết nối WebSocket với Gemini.
        4.  Callback `onopen`: Kết nối thành công, bắt đầu phát âm thanh chào mừng. Sau khi phát xong, kích hoạt micro.
        5.  `startMicrophone()` được gọi, sử dụng `AudioWorklet` để thu âm thanh từ micro, chuyển đổi sang PCM 16-bit và gửi đến Gemini. Trạng thái ứng dụng chuyển sang `LISTENING`.
        6.  Callback `onmessage`: Nhận phản hồi từ Gemini.
            -   Nếu có `outputTranscription`: Cập nhật bong bóng chat của AI.
            -   Nếu có `modelTurn` (audio data): Đưa vào hàng đợi phát âm thanh (`queueAudioChunk`).
            -   Nếu có `toolCall`: Xử lý logic gọi công cụ, cập nhật UI (ví dụ: mở modal), và gửi `sendToolResponse` lại cho Gemini.
            -   Nếu có `turnComplete`: Hoàn tất một lượt hội thoại, lưu vào lịch sử chat.
        7.  Khi người dùng nhấn nút dừng, `useLiveSession.stop()` được gọi, đóng kết nối và dọn dẹp tài nguyên (mic, audio context). Trạng thái ứng dụng quay về `IDLE`.
*   **Dependencies**:
    *   `@google/genai` SDK (Live API).
    *   Browser APIs: `navigator.mediaDevices.getUserMedia`, `AudioContext`, `AudioWorklet`.
    *   `useLiveSession` hook để quản lý logic phiên.
    *   `useAudioPlayback` hook để phát âm thanh.
*   **Acceptance Criteria (for QA)**:
    -   [x] Nhấn nút micro bắt đầu một phiên hội thoại.
    -   [x] Trạng thái "Đang kết nối..." hiển thị và sau đó chuyển thành "Đang lắng nghe...".
    -   [x] AI phát ra lời chào khi kết nối thành công.
    -   [x] Khi người dùng nói, có chỉ báo hình ảnh (sóng âm trong bong bóng chat).
    -   [x] Lời nói của người dùng được AI hiểu và phản hồi một cách hợp lý.
    -   [x] Phản hồi của AI được phát ra dưới dạng âm thanh và hiển thị dưới dạng văn bản.
    -   [x] Yêu cầu chuyển tiền kích hoạt modal chuyển tiền với thông tin được điền sẵn.
    -   [x] Nhấn nút dừng sẽ kết thúc phiên và đưa ứng dụng về trạng thái ban đầu.
    -   [x] Toàn bộ cuộc hội thoại được lưu lại trong lịch sử chat.

#### 3. Analysis & Implementation Plan (Phần của AI)
*   **Phân tích & Kế hoạch**:
    *   Tính năng này là cốt lõi của ứng dụng và đã được triển khai. Kiến trúc hiện tại sử dụng các hook chuyên dụng (`useLiveSession`, `useAudioPlayback`) để tách biệt logic, đây là một phương pháp tốt. `useLiveSession` đóng gói tất cả các tương tác với Gemini Live API, bao gồm thiết lập kết nối, quản lý callback và xử lý các luồng dữ liệu. `useAudioPlayback` chịu trách nhiệm phát lại âm thanh một cách mượt mà.
    *   Việc sử dụng `AudioWorklet` (`audioProcessor.js`) để xử lý âm thanh từ micro trên một luồng riêng biệt là rất quan trọng để đảm bảo hiệu suất và tránh làm treo giao diện người dùng chính.
    *   Luồng quản lý trạng thái (`AppState`) trong `App.tsx` điều khiển toàn bộ giao diện, đảm bảo người dùng luôn biết AI đang làm gì.
*   **Ghi chú triển khai**:
    *   **Quản lý phiên (Session Management)**: Cần đảm bảo rằng các phiên cũ được dọn dẹp hoàn toàn khi người dùng bắt đầu một phiên mới hoặc đóng ứng dụng để tránh rò rỉ tài nguyên. `sessionIdRef` hiện đang được sử dụng để giải quyết vấn đề race condition, đảm bảo các callback từ phiên cũ không ảnh hưởng đến phiên mới.
    *   **Xử lý lỗi (Error Handling)**: Callback `onerror` trong `useLiveSession` phải xử lý các lỗi kết nối một cách nhẹ nhàng, thông báo cho người dùng và đặt lại trạng thái ứng dụng về `IDLE`.
    *   **Độ trễ (Latency)**: Mặc dù Gemini Live API có độ trễ thấp, việc tối ưu hóa phía client vẫn rất quan trọng. `queueAudioChunk` cần đảm bảo phát các đoạn âm thanh nối tiếp nhau một cách liền mạch, sử dụng `AudioContext.currentTime` và `nextStartTimeRef` để lên lịch chính xác.
    *   **Bảo mật**: Logic gọi công cụ (Tool Calling) là một lớp bảo mật quan trọng. `systemInstruction` định nghĩa rõ ràng các quy tắc và giới hạn của AI, và việc triển khai các hàm như `transferMoney` chỉ để chuẩn bị dữ liệu chứ không thực thi là tuân thủ đúng nguyên tắc cốt lõi.