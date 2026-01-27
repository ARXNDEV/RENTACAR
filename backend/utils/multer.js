import multer from "multer";
import DatauriParser from "datauri/parser.js";

const storage = multer.memoryStorage();
//configureing multer to appload single file
export const multerUploads = multer({ storage }).array("image",10);

const parser = new DatauriParser();

export const dataUri = (req) => {
  const encodedFiles = [];
  if (!req.files || !Array.isArray(req.files)) return encodedFiles;
  req.files.forEach((cur) => {
    if (!cur.buffer) return;
    
    // Fallback format if parsing fails
    let base64 = cur.buffer.toString("base64");
    let mimetype = cur.mimetype || 'image/jpeg';
    let base64CloudinaryFormat = `data:${mimetype};base64,${base64}`;

    try {
      let extName = (cur.originalname || 'image.jpg').split('.').pop() || 'jpg';
      let file64 = parser.format('.' + extName, cur.buffer);
      if (file64 && file64.content) {
         base64CloudinaryFormat = file64.content;
      }
    } catch (e) {
      console.warn("DataURI parser error, using manual format", e);
    }
    
    encodedFiles.push({ data: base64CloudinaryFormat, filename: cur.originalname || 'image.jpg' });
  });
  return encodedFiles;
};


//configureing multer to upload multiple files
export const multerMultipleUploads = multer({ storage }).array("image", 10);

// converting buffer to base64
export const base64Converter = (req) => {
  const encodedFiles = [];
  req.files.forEach((cur) => {
    //converts buffer to base64
    let base64 = cur.buffer.toString("base64");
    //adding cloudinary supporting format to base64
    let base64CloudinaryFormat = `data:image/jpeg;base64,${base64}`;
    encodedFiles.push({ data: base64CloudinaryFormat, filename: cur.originalname });
  });
  return encodedFiles;
};


