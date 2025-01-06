'use server';

import fs from 'fs';
import os from 'os';
import path from 'path';

import { v4 as uuidv4 } from 'uuid';

import cloudinary from '@api/config/cloudinaryConfig';
import { CloudinaryError, FileSystemError } from '@services/upload/exception';
import { FileUploadError } from '@services/utils/error';

type NewFilesType = {
  fileName: string;
  filePath: string;
}[];

const CLOUDINARY_FOLDER_NAME = 'next_commerce';

async function uploadImagesToCloudinary(newFiles: NewFilesType) {
  const multipleImagesPromise = newFiles.map(async file => {
    const uploadResponse = await cloudinary.uploader.upload(file.filePath, {
      folder: CLOUDINARY_FOLDER_NAME,
    });

    return {
      ...uploadResponse,
      name: file.fileName,
    };
  });

  return await Promise.all(multipleImagesPromise);
}

async function saveImagesToLocal(data: FormData) {
  try {
    const files = data.getAll('images') as File[];

    const multipleBuffersImages = files.map(file => {
      return file.arrayBuffer().then(item => {
        const buffer = Buffer.from(item);
        const name = uuidv4();

        const [, ext] = file.type.split('/');

        // Doesn't work in vercel
        // const uploadDir = path.join(process.cwd(), 'public/images');
        // if (!fs.existsSync(uploadDir)) {
        //   fs.mkdirSync(uploadDir);
        // }

        const tempDir = os.tmpdir();

        const uploadDir = path.join(tempDir, `/${name}.${ext}`); // work in vercel

        fs.writeFileSync(uploadDir, buffer);

        return {
          filePath: uploadDir,
          fileName: Buffer.from(file.name, 'ascii').toString('utf8'),
        };
      });
    });

    return await Promise.all(multipleBuffersImages);
  } catch (error) {
    console.error(error);

    throw new FileUploadError(
      FileSystemError.FILE_WRITE_FAILED.message,
      FileSystemError.FILE_WRITE_FAILED.code,
    );
  }
}

export async function uploadImages(files: FormData) {
  try {
    const newFiles = await saveImagesToLocal(files);
    const images = await uploadImagesToCloudinary(newFiles);

    newFiles.map(file =>
      fs.unlink(file.filePath, err => {
        if (err) {
          console.error(err);
          throw new FileUploadError(
            CloudinaryError.UPLOAD_FAILED.message,
            CloudinaryError.UPLOAD_FAILED.code,
          );
        }
      }),
    );

    return { message: 'upload success', images };
  } catch (error) {
    console.error(error);

    throw new FileUploadError(
      CloudinaryError.UPLOAD_FAILED.message,
      CloudinaryError.UPLOAD_FAILED.code,
    );
  }
}

export async function getAllImages() {
  try {
    const { resources } = await cloudinary.search
      .expression(`folder:${CLOUDINARY_FOLDER_NAME}/*`)
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();

    return resources;
  } catch (error) {
    console.error(error);

    throw new FileUploadError(
      CloudinaryError.RETRIEVE_FAILED.message,
      CloudinaryError.RETRIEVE_FAILED.code,
    );
  }
}

export async function deleteImages(publicId: string) {
  try {
    cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(error);

    throw new FileUploadError(
      CloudinaryError.DELETE_FAILED.message,
      CloudinaryError.DELETE_FAILED.code,
    );
  }
}
