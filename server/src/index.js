const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv").config();
const app = express();
const userRouter = require("./routes/UserRoute");
const productRouter = require("./routes/ProductRoute");
const saleRouter = require("./routes/SaleRoute");
const customerRouter = require("./routes/CustomerRoute");
const detailSaleRouter = require("./routes/DetailSaleRoute");
const authRouter = require("./routes/AuthRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/sales", saleRouter);
app.use("/api/customers", customerRouter);
app.use("/api/detail-sales", detailSaleRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
