const data = {
  books: [
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
  ],
  loans: [
    {
      id: "h1",
      bookTitle: "Nhà Giả Kim",
      author: "Paulo Coelho",
      borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "Borrowing",
      coverUrl: "https://picsum.photos/id/25/200/300"
    },
    {
      id: "h2",
      bookTitle: "Lập Trình Python Cơ Bản",
      author: "Nguyễn Văn A",
      borrowDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      returnDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "Returned",
      coverUrl: "https://picsum.photos/id/1/200/300"
    },
    {
      id: "h3",
      bookTitle: "Deep Learning",
      author: "Ian Goodfellow",
      borrowDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      returnDate: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "Returned",
      coverUrl: "https://picsum.photos/id/2/200/300"
    },
    {
      id: "h4",
      bookTitle: "Clean Code",
      author: "Robert C. Martin",
      borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "Overdue",
      coverUrl: "https://picsum.photos/id/30/200/300"
    },
    {
      id: "h5",
      bookTitle: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      borrowDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: "",
      status: "Reserved",
      pickupTime: "09:00",
      coverUrl: "https://picsum.photos/id/24/200/300"
    }
  ]
};

module.exports = data;
