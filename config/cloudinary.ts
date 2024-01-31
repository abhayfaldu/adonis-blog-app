import Env from '@ioc:Adonis/Core/Env';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'), 
  api_key: Env.get('CLOUDINARY_API_KEY'),
  api_secret: Env.get('CLOUDINARY_API_SECRET') 
});

// const uploadImage = async (imagePath) => {

//   // Use the uploaded file's name as the asset's public ID and 
//   // allow overwriting the asset with new versions
//   const options = {
//     use_filename: true,
//     unique_filename: false,
//     overwrite: true,
//   };
//   try {
//     // Upload the image
//     const result = await cloudinary.uploader.upload(imagePath, options);
//     console.log(result);
//     return result.public_id;
//   } catch (error) {
//     console.error(error);
//   }
// };

export const getAssetInfo = async (publicId) => {

  // Return colors in the response
  const options = {
    colors: true,
  };

  try {
    // Get details about the asset
    const result = await cloudinary.api.resource(publicId, options);
    console.log(result);
    return result.colors;
  } catch (error) {
    console.error(error);
  }
};

