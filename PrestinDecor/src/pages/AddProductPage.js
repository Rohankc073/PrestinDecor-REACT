import React, { useState } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Bedroom');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (imageUrl) {
      try {
        console.log("Adding product to Firestore...");
        const startTime = Date.now();
        
        await addDoc(collection(firestore, 'products'), {
          name,
          price: parseFloat(price),  // Ensure price is stored as a number
          category,
          description,
          imageUrl
        });

        const endTime = Date.now();
        console.log(`Product added to Firestore in ${endTime - startTime}ms`);
        alert('Product added successfully!');

        setName('');
        setPrice('');
        setCategory('Bedroom');
        setDescription('');
        setImageUrl('');
      } catch (error) {
        console.error("Error adding document: ", error.message);
        alert(`Error adding product: ${error.message}`);
      }
    } else {
      alert('Please provide an image URL.');
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Price (NPR)"
          required
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        >
          <option value="Bedroom">Bedroom</option>
          <option value="Dining Room">Dining Room</option>
          <option value="Living Room">Living Room</option>
        </select>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="text"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder="Image URL"
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
