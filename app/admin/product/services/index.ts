import { uploadImages } from '@actions/upload';

import type { UploadApiResponse } from 'cloudinary';


export async function uploadImagesAndGetUrls(
  images: File[],
): Promise<UploadApiResponse[]> {
  const formData = new FormData();
  images.forEach(item => formData.append('images', item));

  const imageResponse = await uploadImages(formData);
  if (imageResponse.images) {
    return imageResponse.images;
  } else {
    throw new Error('failed image upload');
  }
}
