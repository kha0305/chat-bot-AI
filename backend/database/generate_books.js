const fs = require('fs');
const path = require('path');

const categories = ['Văn học', 'Kinh tế', 'Công nghệ thông tin', 'Ngoại ngữ', 'Kỹ năng sống', 'Lịch sử', 'Khoa học', 'Truyện tranh'];
const authors = ['Nguyễn Nhật Ánh', 'Tô Hoài', 'J.K. Rowling', 'Stephen King', 'Haruki Murakami', 'Dan Brown', 'Agatha Christie', 'Paulo Coelho', 'Dale Carnegie', 'Napoleon Hill'];
const titles = ['Hành trình về phương Đông', 'Đắc Nhân Tâm', 'Nhà Giả Kim', 'Harry Potter', 'Rừng Na Uy', 'Mật mã Da Vinci', 'Án mạng trên sông Nile', 'Bố già', 'Tuổi trẻ đáng giá bao nhiêu', 'Cà phê cùng Tony'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateBooks(count) {
    let sql = "\n\n-- Generated 500 Books\nINSERT INTO sach (tieu_de, tac_gia, the_loai, mo_ta, nam_xuat_ban, trang_thai, anh_bia) VALUES \n";
    const values = [];

    for (let i = 0; i < count; i++) {
        const title = `${getRandomElement(titles)} - Tập ${i + 1}`;
        const author = getRandomElement(authors);
        const category = getRandomElement(categories);
        const desc = `Mô tả ngắn cho cuốn sách ${title}. Một cuốn sách rất hay về chủ đề ${category}.`;
        const year = Math.floor(Math.random() * (2024 - 1980 + 1)) + 1980;
        const status = Math.random() > 0.2 ? 'Available' : (Math.random() > 0.5 ? 'Borrowed' : 'Maintenance');
        const image = `https://picsum.photos/seed/${i + 100}/200/300`;

        values.push(`('${title}', '${author}', '${category}', '${desc}', ${year}, '${status}', '${image}')`);
    }

    sql += values.join(",\n") + ";\n";
    return sql;
}

const initDbPath = path.join(__dirname, 'init_db.sql');
const newBooksSql = generateBooks(500);

fs.appendFileSync(initDbPath, newBooksSql);

console.log('Successfully appended 500 books to init_db.sql');
