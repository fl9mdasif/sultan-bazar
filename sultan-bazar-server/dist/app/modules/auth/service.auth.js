"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const crypto_1 = require("crypto");
const http_status_1 = __importDefault(require("http-status"));
const model_auth_1 = require("./model.auth");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_auth_1 = require("./utils.auth");
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () { return model_auth_1.User.create(Object.assign(Object.assign({}, payload), { role: 'user', isGuest: false })); });
// A shipping email is never used to find or authenticate an existing account.
const guestCheckout = (_email, _fullName, phone) => __awaiter(void 0, void 0, void 0, function* () {
    const guestId = (0, crypto_1.randomUUID)();
    const user = yield model_auth_1.User.create({
        username: `guest_${guestId}`,
        email: `guest_${guestId}@guest.invalid`,
        contactNumber: phone,
        password: (0, crypto_1.randomBytes)(32).toString('hex'),
        role: 'user',
        isGuest: true,
    });
    const jwtPayload = { _id: user._id, username: user.username, email: user.email, role: user.role };
    const accessToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return { accessToken, refreshToken, user: jwtPayload };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_auth_1.User.isUserExists(payload.email);
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, '', 'This user is not found');
    if (user.isBlocked)
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'This account is blocked', 'Account blocked');
    if (!(yield model_auth_1.User.isPasswordMatched(payload.password, user.password))) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, `Password of '${user.role}' does not match`, 'Invalid password');
    }
    const jwtPayload = { _id: user._id, username: user.username, email: user.email, role: user.role };
    const accessToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return { data: { jwtPayload }, accessToken, refreshToken };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_auth_1.User.isUserExists(userData.email);
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This user is not found', 'Not found');
    if (!(yield model_auth_1.User.isPasswordMatched(payload.oldPassword, user.password))) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'Current password does not match', 'Invalid password');
    }
    if (payload.oldPassword === payload.newPassword) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'New password must be different', 'Password change failed');
    }
    const password = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield model_auth_1.User.findOneAndUpdate({ email: userData.email, role: userData.role }, { password, passwordChangedAt: new Date() }, { new: true, runValidators: true });
    return user;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, utils_auth_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const user = yield model_auth_1.User.isUserExists(decoded.email);
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This user is not found');
    if (user.isBlocked)
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'This account is blocked', 'Account blocked');
    if (user.passwordChangedAt && model_auth_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, decoded.iat)) {
        throw new AppErrors_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
    }
    const jwtPayload = { _id: user._id, username: user.username, email: user.email, role: user.role };
    const accessToken = (0, utils_auth_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
exports.authServices = { loginUser, registerUser, changePassword, refreshToken, guestCheckout };
