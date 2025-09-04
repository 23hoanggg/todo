import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { email, z } from "zod";
import jwt from "jsonwebtoken";

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Họ tên là bắt buộc"),

    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),

    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),

    password: z.string(),
  }),
});

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const userResponse = {
      id: savedUser.id,
      fullName: savedUser.fullName,
      email: savedUser.email,
    };

    res
      .status(201)
      .json({ message: "Đăng ký thành công!", user: userResponse });
  } catch (error: any) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET must be defined in .env file");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
