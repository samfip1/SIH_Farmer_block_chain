import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import routes from "./Routes/Routes.js"
import routes from "./routes/Routes.js";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.status(200).send("Server is running and healthy!");
});
app.use("/p", routes);
const PORT = 3012;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map