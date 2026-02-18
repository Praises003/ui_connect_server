import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
}
const expiresIn = process.env.EXPIRES_IN ?? "1h";

const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return process.env.JWT_SECRET;
};

const getRefreshSecret = () => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  return process.env.JWT_REFRESH_SECRET;
};


export const generateAccessToken = (payload: TokenPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!expiresIn) {
  throw new Error("EXPIRES_IN is not defined");
}

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, getRefreshSecret()) as TokenPayload;
};
