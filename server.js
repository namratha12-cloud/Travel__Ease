const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express(); // ✅ app is defined here

app.use(cors());
app.use(express.json());

// ================= MYSQL CONNECTION =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // change if needed
  password: "root",       // change if needed
  database: "Travels1"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL Error:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

// ================= SEARCH BUS =================
app.get("/search-bus", (req, res) => {
  const { from, to, date } = req.query;

  const sql = `
    SELECT b_id AS busId, b_scr AS source, b_dest AS destination, b_time AS departure
    FROM bus
    WHERE b_scr=? AND b_dest=? AND b_date=?
  `;

  db.query(sql, [from, to, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});
// ================= BOOK TICKET (FIXED LOGIC) =================
app.post("/book", (req, res) => {
  const { p_id, a_id, b_id, date, time } = req.body;

  // 1️⃣ CHECK IF BUS EXISTS FOR DATE & TIME
  const checkSql = `
    SELECT * FROM bus
    WHERE b_id = ? AND b_date = ? AND b_time = ?
  `;

  db.query(checkSql, [b_id, date, time], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // ❌ BUS NOT FOUND → SUGGEST AVAILABLE BUSES
    if (rows.length === 0) {

      const suggestSql = `
        SELECT b_id, b_time
        FROM bus
        WHERE b_date = ?
        ORDER BY b_id, b_time
      `;

      db.query(suggestSql, [date], (e, buses) => {
        if (e || buses.length === 0) {
          return res.status(400).json({
            error: "❌ No buses available on this date"
          });
        }

        return res.status(400).json({
          error: "❌ Bus not available for selected date & time",
          suggestions: buses
        });
      });

      return;
    }

    // 2️⃣ BUS EXISTS → INSERT BOOKING
    const insertSql = `
      INSERT INTO booking (p_id, a_id, b_id, b_date, b_time)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [p_id, a_id, b_id, date, time], (err2) => {
      if (err2) {
        return res.status(400).json({ error: err2.message });
      }

      res.json({ message: "✅ Booking successful" });
    });
  });
});


// ================= VIEW BOOKING =================
app.get("/view-booking/:pid", (req, res) => {
  const pid = req.params.pid;

  const sql = `
    SELECT b.b_id AS busId, b.b_scr AS source, b.b_dest AS destination,
           bo.b_date AS travelDate, bo.b_time AS departure,
           a.a_name AS agencyName
    FROM booking bo
    JOIN bus b ON bo.b_id = b.b_id
    JOIN agency a ON bo.a_id = a.a_id
    WHERE bo.p_id = ?
  `;

  db.query(sql, [pid], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ================= ERROR HANDLER (KEEP AT END) =================
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

// ================= START SERVER =================
app.listen(7000, () => {
  console.log("🚀 Server running on port 7000");
});
