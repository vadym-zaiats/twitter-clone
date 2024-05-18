import path from "path";

export const generateUniqueFilename = (originalName: string) => {
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  const cleanedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, "_");
  const timestamp = Date.now();
  return `${cleanedBaseName}_${timestamp}${extension}`;
};
