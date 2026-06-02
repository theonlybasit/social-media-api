require("dotenv").config();
const express = require("express");
const authRoute = require("./routes/auth.route.js");
const postRoute = require("./routes/post.route.js");
const connectDB = require("./config/db.js");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://127.0.0.1:5500",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
// app.use(helmet())
app.use(cors(corsOptions));

connectDB();

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK", timestamp: Date.now() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
