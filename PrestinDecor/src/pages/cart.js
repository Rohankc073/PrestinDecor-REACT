
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const handleAddToCart = async (user, productId, productName, price, imageUrl) => {
    // Check if the user is authenticated
    if (!user) {
        alert('Please log in to add the product to the cart.');
        console.log('User not logged in. Please log in to add to cart.');

        return;
    }
    else
    console.log('User:', user);

    const quantity = 1;
    alert("Product Added to cart");

    try {
        // Reference to the 'carts' collection in Firestore
        const cartsRef = collection(db, 'carts');

        // Query to find the user's cart based on userId
        const userCartQuery = query(cartsRef, where('userId', '==', user.uid));

        // Get the query snapshot
        const userCartSnapshot = await getDocs(userCartQuery);

        const userCartDoc = userCartSnapshot.docs[0];
        const userCartItemsRef = collection(db, 'carts', userCartDoc.id, 'items');
        // Add the new item to the 'items' subcollection
        await addDoc(userCartItemsRef, {
            productId: productId,
            productName: productName,
            quantity: quantity,
            price: price || 0,
            totalprice: quantity * parseInt(price || 0),
            image: imageUrl || '',
        });

        console.log('Item added to cart');
    } catch (error) {
        console.error('Error adding to cart:', error.message);
    }
};
