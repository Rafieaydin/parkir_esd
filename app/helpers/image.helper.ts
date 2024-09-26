import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface UploadResponse {
  status: number;
  message: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveImage = async (image: any, slug: string, imagePath: string): Promise<string | UploadResponse> => {
  const nameFile = `${slug}.jpg`;
  console.log("here");
  console.log(typeof image);

  try {
    await image.mv(`./public/images/${imagePath}/${nameFile}`);
    return `/images/${imagePath}/${nameFile}`;
  } catch (err) {
    return {
      status: 400,
      message: "Failed Upload Image"
    };
  }
};

export const deleteImage = async (imagePath: string): Promise<{ status: number, message: string }> => {
  // Resolve the path relative to the uploads directory
  const fullPath = path.join(__dirname, '../../', imagePath);
  try {
    // Check if the file exists and then delete it
    if(await fs.existsSync(fullPath)){
      await fs.unlinkSync(fullPath)
  }

    return {
      status: 200,
      message: 'Success Delete Image',
    };
  } catch (error) {
    return {
      status: 404,
      message: 'File not found or cannot be deleted',
    };
  }
};
