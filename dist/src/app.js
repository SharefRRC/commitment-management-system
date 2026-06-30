"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const swagger_1 = require("./config/swagger");
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
const publicPath = path_1.default.resolve(__dirname, "../../public");
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Commitment Management System API is running"
    });
});
(0, swagger_1.setupSwagger)(app);
app.use("/api", routes_1.default);
app.use(express_1.default.static(publicPath));
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(publicPath, "index.html"));
});
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
