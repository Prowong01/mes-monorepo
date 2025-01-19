import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import apiRoutes from "./api/index";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", apiRoutes);

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});