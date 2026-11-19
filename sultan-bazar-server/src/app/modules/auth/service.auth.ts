/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomBytes, randomUUID } from 'crypto';
import httpStatus from 'http-status';
import { User } from './model.auth';
import { TLoginUser, TUser } from './interface.auth';
import AppError from '../../errors/AppErrors';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './utils.auth';
import { JwtPayload } from 'jsonwebtoken';

const registerUser = async (payload: TUser) => User.create({ ...payload, role: 'user', isGuest: false });

// A shipping email is never used to find or authenticate an existing account.
const guestCheckout = async (_email: string, _fullName: string, phone: string) => {
  const guestId = randomUUID();
  const user = await User.create({
    username: `guest_${guestId}`,
    email: `guest_${guestId}@guest.invalid`,
    contactNumber: phone,
    password: randomBytes(32).toString('hex'),
    role: 'user',
    isGuest: true,
  });

  const jwtPayload: any = { _id: user._id as string, username: user.username, email: user.email, role: user.role };
  const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
  const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);
  return { accessToken, refreshToken, user: jwtPayload };
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExists(payload.email);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, '', 'This user is not found');
  if (user.isBlocked) throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked', 'Account blocked');
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, `Password of '${user.role}' does not match`, 'Invalid password');
  }
  const jwtPayload: any = { _id: user._id as string, username: user.username, email: user.email, role: user.role };
  const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
  const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);
  return { data: { jwtPayload }, accessToken, refreshToken };
};

const changePassword = async (userData: JwtPayload, payload: { oldPassword: string; newPassword: string }) => {
  const user = await User.isUserExists(userData.email);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'This user is not found', 'Not found');
  if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Current password does not match', 'Invalid password');
  }
  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'New password must be different', 'Password change failed');
  }
  const password = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));
  await User.findOneAndUpdate({ email: userData.email, role: userData.role }, { password, passwordChangedAt: new Date() }, { new: true, runValidators: true });
  return user;
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string) as JwtPayload;
  const user = await User.isUserExists(decoded.email as string);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  if (user.isBlocked) throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked', 'Account blocked');
  if (user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, decoded.iat as number)) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  const jwtPayload: any = { _id: user._id as string, username: user.username, email: user.email, role: user.role };
  const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
  return { accessToken };
};

export const authServices = { loginUser, registerUser, changePassword, refreshToken, guestCheckout };
