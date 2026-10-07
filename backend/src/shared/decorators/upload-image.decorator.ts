import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ImageUploadInterceptor } from '../interceptors/image-upload.interceptor';

export function UploadImage(fieldName: string, maxSizeMB = 1) {
  return applyDecorators(
    UseInterceptors(ImageUploadInterceptor(fieldName, maxSizeMB)),
  );
}
