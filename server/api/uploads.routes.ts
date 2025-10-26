import { Router, type Request } from "express";
import multer from "multer";
import { requireAuth } from "../modules/middleware/auth";
import { uploadsDir } from "../modules/uploads";
import path from "node:path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = crypto.randomBytes(8).toString("hex");
    cb(null, `${base}${ext}`);
  },
});

const upload = multer({ storage });

export const uploadsRouter = Router();

type UploadedFilePayload = {
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
};

type UploadRequest = Request & { file?: UploadedFilePayload };

uploadsRouter.post(
  "/uploads",
  requireAuth,
  upload.single("file"),
  (req, res) => {
    const { file } = req as UploadRequest;
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }
    res.status(201).json({
      file: {
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  },
);
