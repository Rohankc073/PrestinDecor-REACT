import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ImageUploadPage = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (event) => {
    event.preventDefault();
    if (image) {
      const storageRef = ref(storage, `products/${image.name}`);
      try {
        console.log("Uploading image...");
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
        alert('Image uploaded successfully!');
      } catch (error) {
        console.error("Error uploading image: ", error.message);
        alert(`Error uploading image: ${error.message}`);
      }
    } else {
      alert('Please select an image to upload.');
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Upload Image</button>
      </form>
      {imageUrl && (
        <div>
          <p>Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
          <p>Use this URL in the Add Product form.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPage;
