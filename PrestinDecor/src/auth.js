// auth.js
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import {auth, database, db} from './firebase';

const handleSignup = async (email, password, fullName) => {
    try {
        const auth = getAuth();

        // Sign up with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // After successful signup, store additional user data in Realtime Database
        const userId = userCredential.user.uid;

        // Customize this as per your user data structure in the Realtime Database
        const userData = {
            fullName: fullName,
            email: email,
           
        };

        const userRef = ref(db, `users/${userId}`);
        await set(userRef, userData);

        
    } catch (error) {
        console.error('Signup error:', error.message);
        
    }
};

export { handleSignup };
