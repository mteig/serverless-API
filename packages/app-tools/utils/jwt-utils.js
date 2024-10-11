import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import moment from 'moment';
import CONSTANTS from './constants.js';
import { log } from './log.js';
import { dbManager, dbReady } from '../db/database-manager.js';

const SECRET_KEY = CONSTANTS.JWT_SECRET_KEY;
const REFRESH_SECRET_KEY = CONSTANTS.JWT_REFRESH_SECRET_KEY;
const ACCESS_TOKEN_EXPIRY = '30d'; // 1 hour
const REFRESH_TOKEN_EXPIRY = '365d'; // 7 days

export function generateAccessToken(user) {
  return jwt.sign({ userId: user.userid, email: user.email }, SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export async function generateAccessTokenFromRefreshToken(token, user) {
  const result = await verifyRefreshToken(token, user.userid);
  if (!result) {
    throw new Error('Invalid refresh token');
  }
  return jwt.sign({ userId: user.userid, email: user.email }, SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export async function generateRefreshToken(user, prevToken) {
  const refreshToken = jwt.sign(
    { userId: user.userid, email: user.email },
    REFRESH_SECRET_KEY,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  log.error({ refreshToken }, 'jwt-utils::generateRefreshToken::refreshToken');
  await dbReady;
  await dbManager.getModels().RefreshTokens.create({
    userId: user.userid,
    enabled: true,
    refreshToken: hashToken(refreshToken),
    expires: moment().add(REFRESH_TOKEN_EXPIRY, 'days').toDate(),
  });
  if (prevToken) {
    await dbManager.getModels().RefreshTokens.destroy({
      where: { refreshToken: hashToken(prevToken) },
    });
  }
  return refreshToken;
}

export function verifyAccessToken(token, tokenUserId) {
  try {
    const { userId } = jwt.verify(token, SECRET_KEY);
    return userId === Number.parseInt(tokenUserId, 10);
  } catch (error) {
    log.error({ error }, 'jwt-utils::verifyAccessToken::error');
  }
  return false;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function verifyRefreshToken(token, tokenUserId) {
  try {
    const result = jwt.verify(token, REFRESH_SECRET_KEY);
    await dbReady;
    if (!result || result.userId !== Number.parseInt(tokenUserId, 10)) {
      await dbManager.getModels().RefreshTokens.destroy({
        where: { refreshToken: hashToken(token) },
      });
      return false;
    }
    const refreshToken = await dbManager.getModels().RefreshTokens.findOne({
      where: { refreshToken: hashToken(token) },
    });
    if (!refreshToken || !refreshToken.enabled) {
      await refreshToken.destroy();
      return false;
    }
    return true;
  } catch (error) {
    log.error({ error }, 'jwt-utils::verifyRefreshToken::error');
  }
  return false;
}
