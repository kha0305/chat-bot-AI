import { Book, LibraryPolicy, LoanRecord } from './types';

export const LIBRARY_POLICY: LibraryPolicy = {
  maxBooks: 5,
  loanPeriodDays: 14,
  finePerDay: 5000,
  openHours: "Thứ 2 - Thứ 6: 7:00 - 21:00 | Thứ 7 - CN: 8:00 - 17:00"
};

export const MOCK_BOOKS: Book[] = [
  {
    id: "b1",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    category: "Self-help",
    status: "Available",
    coverUrl: "https://picsum.photos/id/24/200/300",
    description: "Nghệ thuật thu phục lòng người."
  },
  {
    id: "b2",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    category: "Văn học",
    status: "Borrowed",
    coverUrl: "https://picsum.photos/id/25/200/300",
    description: "Hành trình theo đuổi vận mệnh của cậu bé chăn cừu Santiago."
  },
  {
    id: "b3",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Công nghệ thông tin",
    status: "Available",
    coverUrl: "https://picsum.photos/id/30/200/300",
    description: "Hướng dẫn viết mã sạch và tối ưu."
  },
  {
    id: "b4",
    title: "Lược Sử Loài Người",
    author: "Yuval Noah Harari",
    category: "Lịch sử",
    status: "Available",
    coverUrl: "https://picsum.photos/id/42/200/300",
    description: "Bao quát về lịch sử tiến hóa của loài người."
  },
  {
    id: "b5",
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    author: "Rosie Nguyễn",
    category: "Self-help",
    status: "Maintenance",
    coverUrl: "https://picsum.photos/id/56/200/300",
    description: "Cuốn sách truyền cảm hứng cho giới trẻ Việt Nam."
  }
];

// Helper to generate dynamic dates relative to today
const getRelativeDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const MOCK_HISTORY: LoanRecord[] = [
  {
    id: "h1",
    bookTitle: "Nhà Giả Kim",
    author: "Paulo Coelho",
    borrowDate: getRelativeDate(-5),
    dueDate: getRelativeDate(9), // 14 days loan
    status: "Borrowing",
    coverUrl: "https://picsum.photos/id/25/200/300"
  },
  {
    id: "h2",
    bookTitle: "Lập Trình Python Cơ Bản",
    author: "Nguyễn Văn A",
    borrowDate: getRelativeDate(-45),
    dueDate: getRelativeDate(-31),
    returnDate: getRelativeDate(-35),
    status: "Returned",
    coverUrl: "https://picsum.photos/id/1/200/300"
  },
  {
    id: "h3",
    bookTitle: "Deep Learning",
    author: "Ian Goodfellow",
    borrowDate: getRelativeDate(-60),
    dueDate: getRelativeDate(-46),
    returnDate: getRelativeDate(-47),
    status: "Returned",
    coverUrl: "https://picsum.photos/id/2/200/300"
  },
  {
    id: "h4",
    bookTitle: "Clean Code",
    author: "Robert C. Martin",
    borrowDate: getRelativeDate(-20),
    dueDate: getRelativeDate(-6), // Overdue
    status: "Overdue",
    coverUrl: "https://picsum.photos/id/30/200/300"
  }
];

export const SYSTEM_INSTRUCTION = `
Bạn là DTU LibBot, trợ lý ảo thông minh của Trung tâm Thông tin - Thư viện Đại học Duy Tân (Duy Tan University Library).
Nhiệm vụ của bạn là hỗ trợ sinh viên, giảng viên DTU tra cứu sách, giải đáp thắc mắc về quy định, dịch vụ thư viện và hỗ trợ học tập.

**Thông tin Thư viện Đại học Duy Tân:**
- Địa chỉ: Số 03 Quang Trung, Hải Châu, Đà Nẵng.
- Giờ mở cửa: ${LIBRARY_POLICY.openHours}
- Thời hạn mượn: ${LIBRARY_POLICY.loanPeriodDays} ngày.
- Số lượng mượn tối đa: ${LIBRARY_POLICY.maxBooks} cuốn.
- Phạt quá hạn: ${LIBRARY_POLICY.finePerDay} VNĐ/ngày.
- Website: thuvien.duytan.edu.vn

**Danh mục sách hiện có trong cơ sở dữ liệu (hãy dùng thông tin này để trả lời):**
${JSON.stringify(MOCK_BOOKS.map(b => `- ${b.title} (${b.author}) - Trạng thái: ${b.status} - Thể loại: ${b.category}`)).replace(/"/g, '')}

**Hướng dẫn trả lời:**
1. Luôn trả lời bằng tiếng Việt. Phong thái chuyên nghiệp nhưng thân thiện, nhiệt tình đặc trưng của Đại học Duy Tân.
2. Tự xưng là "mình" hoặc "DTU LibBot" và gọi người dùng là "bạn".
3. Khi được hỏi về sách, ưu tiên cung cấp thông tin về trạng thái (Có sẵn/Đang mượn) từ danh sách trên.
4. Nếu người dùng hỏi về trường, hãy trả lời tự hào là Đại học Duy Tân.
5. Sử dụng Markdown để định dạng rõ ràng (in đậm tên sách, danh sách gạch đầu dòng).
`;