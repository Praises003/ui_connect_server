"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommunity = exports.leaveCommunity = exports.joinCommunity = exports.getCommunityById = exports.getAllCommunities = exports.createCommunity = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const community_service_1 = require("./community.service");
const community_schema_1 = require("./community.schema");
exports.createCommunity = (0, express_async_handler_1.default)(async (req, res) => {
    const validatedData = community_schema_1.createCommunitySchema.parse(req.body);
    const community = await (0, community_service_1.createCommunityService)(req.user.userId, validatedData);
    res.status(201).json(community);
});
exports.getAllCommunities = (0, express_async_handler_1.default)(async (req, res) => {
    const communities = await (0, community_service_1.getAllCommunitiesService)();
    res.json(communities);
});
exports.getCommunityById = (0, express_async_handler_1.default)(async (req, res) => {
    const community = await (0, community_service_1.getCommunityByIdService)(req.params.id);
    if (!community) {
        res.status(404);
        throw new Error("Community not found");
    }
    res.json(community);
});
exports.joinCommunity = (0, express_async_handler_1.default)(async (req, res) => {
    const membership = await (0, community_service_1.joinCommunityService)(req.user.userId, req.params.id);
    res.json(membership);
});
exports.leaveCommunity = (0, express_async_handler_1.default)(async (req, res) => {
    await (0, community_service_1.leaveCommunityService)(req.user.userId, req.params.id);
    res.json({ message: "Left community successfully" });
});
exports.deleteCommunity = (0, express_async_handler_1.default)(async (req, res) => {
    await (0, community_service_1.deleteCommunityService)(req.user.userId, req.params.id);
    res.json({ message: "Community deleted successfully" });
});
