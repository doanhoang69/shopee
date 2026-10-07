import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploadInterceptor(fieldName: string, maxSizeMB = 1) {
  return FileInterceptor(fieldName, {
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(
          new BadRequestException('Chỉ hỗ trợ định dạng .jpeg, .png, .webp'),
          false,
        );
      }
      cb(null, true);
    },
  });
}
