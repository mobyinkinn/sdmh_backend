// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
// });

// const uploadOnLocalServer = async (localFilePath) => {
//   console.log("local file path: ", localFilePath);
//   try {
//     if (!localFilePath) return null;
//     const response = await cloudinary.uploader
//       .upload(localFilePath, {
//         resource_type: "auto",
//       })
//       .catch((error) => {
//         console.log("Cloudinary upload error");
//       });
//     console.log("File uploaded successfully", response.url);
//     fs.unlinkSync(localFilePath);
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath);
//     console.error("Devloper file upload error");
//     return null;
//   }
// };

// export { uploadOnLocalServer };

// import path from "path";
// import fs from "fs";
// import { v4 as uuidv4 } from "uuid";

// const uploadOnLocalServer = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     const uploadsFolder = path.join(process.cwd(), "uploads");

//     // Create uploads folder if not exists
//     if (!fs.existsSync(uploadsFolder)) {
//       fs.mkdirSync(uploadsFolder);
//     }

//     const ext = path.extname(localFilePath); // Get file extension
//     const uniqueName = `${uuidv4()}${ext}`; // Generate unique name
//     const destinationPath = path.join(uploadsFolder, uniqueName);

//     // Move file to uploads folder
//     fs.renameSync(localFilePath, destinationPath);

//     // Return public URL (change if hosted differently)
//     const url = `/uploads/${uniqueName}`;
//     return { url, fileName: uniqueName };
//   } catch (error) {
//     console.error("Error saving file to local server:", error);
//     fs.unlinkSync(localFilePath); // Clean up if error
//     return null;
//   }
// };

// export { uploadOnLocalServer };



import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const uploadOnLocalServer = async (localFilePath, originalName) => {
  try {
    if (!localFilePath || !originalName) return null;

    const uploadsFolder = path.join(process.cwd(), "uploads");

    // Create uploads folder if it doesn't exist
    if (!fs.existsSync(uploadsFolder)) {
      fs.mkdirSync(uploadsFolder);
    }

    const ext = path.extname(originalName); // Correct file extension
    const uniqueName = `${uuidv4()}${ext}`;
    const destinationPath = path.join(uploadsFolder, uniqueName);

    fs.renameSync(localFilePath, destinationPath);

    // Return relative URL for frontend use
    const url = `/uploads/${uniqueName}`;
    return { url, fileName: uniqueName };
  } catch (error) {
    console.error("Error saving file to local server:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnLocalServer };
