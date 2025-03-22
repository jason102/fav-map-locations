import Compressor from "compressorjs";

const RESIZE_IMAGE_HEIGHT = 800; // px
const FILE_COMPRESSION_QUALITY = 0.8; // 80%

// Initially I tried to use https://github.com/Donaldcwl/browser-image-compression
// to do both resizing and compressing but could not achieve as good a result
// as using resizeImage() and compressorjs below
// This one courtesy of ChatGPT:
export const resizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result || typeof e.target.result !== "string") {
        reject(new Error("Failed to load the file"));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (height > RESIZE_IMAGE_HEIGHT) {
          width *= RESIZE_IMAGE_HEIGHT / height;
          height = RESIZE_IMAGE_HEIGHT;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        }, "image/jpeg"); // Adjust the output format as needed
      };

      img.onerror = () => reject(new Error("Failed to load the image"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read the file"));
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file: Blob): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: FILE_COMPRESSION_QUALITY,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err.message);
      },
    });
  });
};

// https://stackoverflow.com/a/65586375
const file2Base64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || "");
    reader.onerror = (error) => reject(error);
  });
};

export const convertImageFilesToBase64Strings = async (formData: FormData) => {
  const file2Base64Promises = Array.from(formData.values()).map((file) =>
    file2Base64(file as File)
  );

  const base64Files = await Promise.all(file2Base64Promises);

  return base64Files;
};
