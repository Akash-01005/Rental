import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (file, type = 'profile') => {
  try {
    const options = {
      folder: `rental-harmony/${type}s`,
      quality: 'auto',
      fetch_format: 'auto'
    };

    // Add specific configurations based on image type
    if (type === 'profile') {
      options.width = 500;
      options.height = 500;
      options.crop = 'fill';
      options.gravity = 'face';
    } else if (type === 'property') {
      options.width = 1200;
      options.height = 800;
      options.crop = 'fill';
      options.quality = 'auto:best';
    }

    const result = await cloudinary.uploader.upload(file.path, options);
    
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to cloud storage');
  }
};

export const uploadMultipleImages = async (files, type = 'property') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, type));
    const results = await Promise.all(uploadPromises);
    
    return results.map(result => ({
      url: result.url,
      public_id: result.public_id
    }));
  } catch (error) {
    console.error('Multiple images upload error:', error);
    throw new Error('Failed to upload multiple images');
  }
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from cloud storage');
  }
};

export const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteImage(publicId));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Multiple images delete error:', error);
    throw new Error('Failed to delete multiple images');
  }
};

export const updateImage = async (file, oldPublicId, type = 'profile') => {
  try {
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }
    return await uploadImage(file, type);
  } catch (error) {
    console.error('Cloudinary update error:', error);
    throw new Error('Failed to update image in cloud storage');
  }
};

export const updatePropertyImages = async (newFiles, oldPublicIds = []) => {
  try {
    // Delete old images if they exist
    if (oldPublicIds.length > 0) {
      await deleteMultipleImages(oldPublicIds);
    }

    // Upload new images
    return await uploadMultipleImages(newFiles, 'property');
  } catch (error) {
    console.error('Property images update error:', error);
    throw new Error('Failed to update property images');
  }
};

// Utility function to extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  try {
    const splitUrl = url.split('/');
    const filename = splitUrl[splitUrl.length - 1];
    return filename.split('.')[0];
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

// Utility function to optimize image transformation
export const getOptimizedImageUrl = (url, options = {}) => {
  try {
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const transformation = [];

    if (options.width) transformation.push(`w_${options.width}`);
    if (options.height) transformation.push(`h_${options.height}`);
    if (options.crop) transformation.push(`c_${options.crop}`);
    if (options.quality) transformation.push(`q_${options.quality}`);

    // Always add format and quality optimizations
    transformation.push('f_auto,q_auto');

    const transformationString = transformation.join(',');
    const imagePath = url.split('/upload/')[1];

    return `${baseUrl}${transformationString}/${imagePath}`;
  } catch (error) {
    console.error('Error creating optimized URL:', error);
    return url;
  }
};

export default cloudinary;