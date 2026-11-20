"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const access_1 = require("../policies/access");
const authorize = (action) => (0, auth_1.default)(...access_1.ACCESS_POLICY[action]);
exports.default = authorize;
