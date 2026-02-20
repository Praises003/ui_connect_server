"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const post_service_1 = require("./post.service");
const post_schema_1 = require("./post.schema");
exports.createPost = (0, express_async_handler_1.default)(async (req, res) => {
    const validatedData = post_schema_1.createPostSchema.parse(req.body);
    const post = await (0, post_service_1.createPostService)(req.user.userId, validatedData);
    res.status(201).json(post);
});
exports.getAllPosts = (0, express_async_handler_1.default)(async (_req, res) => {
    const posts = await (0, post_service_1.getAllPostsService)();
    res.json(posts);
});
exports.getPostById = (0, express_async_handler_1.default)(async (req, res) => {
    const post = await (0, post_service_1.getPostByIdService)(req.params.id);
    res.json(post);
});
exports.deletePost = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, post_service_1.deletePostService)(req.params.id, req.user.userId);
    res.json(result);
});
