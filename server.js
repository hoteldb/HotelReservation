const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const paymentRoutes = require("./backend/routes/payment");
const hotelRoutes = require("./backend/routes/hotel"); // 새로 만든 라우터 파일

const app = express();
app.use(cors());
app.use(express.json());

// MySQL 연결 설정 
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: "localhost", // MySQL 서버 주소
      user: "root",      // MySQL 사용자
      password: "0213",  // MySQL 비밀번호
      database: "hotel_db", // 사용할 데이터베이스 이름
    });
    console.log("Connected to MySQL Database!");
  } catch (err) {
    console.error("DB connection error: ", err);
  }
})();

// MySQL 연결 공유
app.use((req, res, next) => {
  req.db = db; // 요청 객체에 db 연결 추가
  next();
});
// 장바구니 추가 API
app.post("/add-to-cart", async (req, res) => {
  const { user_id, hotel_id } = req.body;

  // `cart_id`는 고유 ID로 생성 (예: 현재 시각 기반)
  const cart_id = Math.floor(Date.now() / 1000) % 100000;

  const query = `
    INSERT INTO shopping_cart ( user_id, hotel_id)
    VALUES (?, ?)
  `;

  try {
    // 장바구니 중복 확인
    const [existingCart] = await db.query(
      `SELECT * FROM shopping_cart WHERE user_id = ? AND hotel_id = ?`,
      [user_id, hotel_id]
    );

    if (existingCart.length > 0) {
      return res.status(400).json({ success: false, message: "이미 장바구니에 추가된 호텔입니다." });
    }

    // 장바구니에 데이터 삽입
    await db.query(query, [user_id, hotel_id]);
    res.status(200).json({ success: true, message: "장바구니에 추가되었습니다.", cart_id });
  } catch (err) {
    console.error("장바구니 추가 오류:", err.message);
    res.status(500).json({ success: false, message: "서버 오류: 장바구니에 추가하지 못했습니다." });
  }
});


// 로그인 API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("로그인 요청 데이터:", req.body); // 디버깅용 로그

  try {
    const sqlQuery = "SELECT user_id, a_password FROM users WHERE email = ?";
    const [rows] = await db.query(sqlQuery, [email]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "등록되지 않은 이메일입니다." });
    }

    const user = rows[0];
    if (user.a_password !== password) {
      return res.json({ success: false, message: "비밀번호가 올바르지 않습니다." });
    }

    res.json({ success: true, userId: user.user_id });
  } catch (err) {
    console.error("로그인 처리 오류:", err);
    res.status(500).send("서버 오류");
  }
});

app.post("/signup", async (req, res) => {
  const { email, username, password, like_type } = req.body;

  // user_id를 현재 시각 기반으로 축약 생성
  const user_id = Math.floor(Date.now() / 1000) % 100000; // 현재 초 단위로 줄이고 5자리로 제한

  const query = `
    INSERT INTO users (user_id, email, username, a_password, like_type)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    await db.query(query, [user_id, email, username, password, like_type]);
    res.status(200).send("회원가입 성공");
  } catch (err) {
    console.error("회원가입 오류:", err.message);
    res.status(500).send("서버 오류");
  }
});



// 호텔 타입 가져오기 (GET 요청)
app.get("/hotel-types", async (req, res) => {
  const sqlQuery = "SELECT * FROM hotel_type";
  try {
    const [result] = await db.query(sqlQuery);
    res.send(result);
  } catch (err) {
    console.error("호텔 타입 가져오기 오류:", err.message);
    res.status(500).send("서버 오류");
  }
});

// 호텔 목록 가져오기 (GET 요청)
app.get("/hotels", async (req, res) => {
  console.log("hotels");
  const sqlQuery = `
  SELECT 
    h.hotel_id, 
    h.hotel_name, 
    h.price_range, 
    h.rating_avg, 
    hi.hotel_image_url 
  FROM hotel h
  LEFT JOIN hotel_image hi ON h.hotel_id = hi.hotel_id
`;
  try {
    const [result] = await db.query(sqlQuery);
    res.send(result);
  } catch (err) {
    console.error("호텔 목록 가져오기 오류:", err.message);
    res.status(500).send("서버 오류");
  }
});


// 결제 API (POST 요청)
app.post("/api/payment", async (req, res) => {
  const { roomId, userId, checkInDate, checkOutDate } = req.body;

  const insertQuery = `
    INSERT INTO booking (room_id, user_id, checkin_date, checkout_date, booking_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  const bookingDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    const [result] = await db.query(insertQuery, [roomId, userId, checkInDate, checkOutDate, bookingDate]);
    console.log("결제 성공, 예약이 생성되었습니다:", result);
    res.status(200).send("Payment successful and reservation created");
  } catch (err) {
    console.error("결제 처리 중 오류:", err.message);
    res.status(500).send("Error processing payment");
  }
});

// 장바구니에 담긴 호텔 정보 가져오기
app.get('/api/cart/:userId', async (req, res) => {
  const userId = req.params.userId; // 클라이언트에서 전달된 userId

  try {
    const sqlQuery = `
      SELECT 
        c.cart_id, 
        h.hotel_name, 
        l.city_name, 
        l.country_name,  
        h.price_range, 
        hi.hotel_image_url 
      FROM shopping_cart c
      JOIN hotel h ON c.hotel_id = h.hotel_id
      LEFT JOIN location l ON h.location_id = l.location_id
      LEFT JOIN room r ON h.hotel_id = r.hotel_id
      LEFT JOIN hotel_image hi ON h.hotel_id = hi.hotel_id
      WHERE c.user_id = ?
    `;
    
    const [cartItems] = await db.query(sqlQuery, [userId]);
    res.json(cartItems); // 장바구니 정보와 관련된 호텔 데이터 반환
  } catch (err) {
    console.error("장바구니 정보 가져오기 오류:", err.message);
    res.status(500).send("서버 오류");
  }
});

// 사용자 정보 가져오기 (GET 요청)
app.get('/api/user-info', async (req, res) => {
  const { userId } = req.query;

  try {
    const sqlQuery = `SELECT username FROM users WHERE user_id = ?`;
    const [rows] = await db.query(sqlQuery, [userId]);

    if (rows.length === 0) {
      return res.status(404).send({ error: '사용자 정보가 없습니다.' });
    }

    res.json(rows[0]); // 사용자 이름만 반환
  } catch (err) {
    console.error("사용자 정보 가져오기 오류:", err.message);
    res.status(500).send("서버 오류");
  }
});

// 예약 내역 가져오기
app.get('/api/reservations', async (req, res) => {
  const { userId } = req.query; // 사용자 ID
  console.log("API 요청된 userId:", userId);

  try {
    const sqlQuery = `
      SELECT 
        b.booking_id, 
        h.hotel_name, 
        rt.room_name,  
        b.checkin_date, 
        b.checkout_date, 
        b.booking_date, 
        b.room_id,
        h.price_range,
        hi.hotel_image_url
        FROM booking b
        JOIN room r ON b.room_id = r.room_id
        JOIN room_type rt ON r.room_type_id = rt.room_type_id
        JOIN hotel h ON r.hotel_id = h.hotel_id
        LEFT JOIN hotel_image hi ON h.hotel_id = hi.hotel_id
        WHERE b.user_id = ?;
      `;

    const [bookings] = await db.query(sqlQuery, [userId]);
    console.log("예약 내역 결과:", bookings);

    if (bookings.length === 0) {
      return res.status(404).json({ message: "예약 내역이 없습니다." });
    }
    
    res.json(bookings); // 예약 내역을 반환
  } catch (err) {
    console.error('예약 내역 가져오기 오류:', err.message);
    res.status(500).send('서버 오류');
  }
});

app.use("/api/hotel", hotelRoutes);
app.use("/api/payment", (req, res, next) => {
  req.db = db; // 요청 객체에 db 추가
  next();
}, paymentRoutes);

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
