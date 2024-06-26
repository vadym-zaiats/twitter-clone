import Validator from "fastest-validator";
import crypto from "crypto";

export const validateService = new Validator();

export const userSchema = {
  email: { type: "email" },
  userName: { type: "string", min: 2 },
  displayName: { type: "string", min: 2 },
  password: { type: "string", min: 6 },
  confirmPassword: { type: "equal", field: "password" },
};

export const newPassSchema = {
  newPassword: { type: "string", min: 6 },
  confirmNewPassword: { type: "equal", field: "newPassword" },
};

export const checkUserService = validateService.compile(userSchema);

export const checkNewPassService = validateService.compile(newPassSchema);

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}
