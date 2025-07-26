import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      favorites: []
    }, { merge: true });
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const saveFavorite = async (userId, disaster) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const currentFavorites = userDoc.data()?.favorites || [];
    
    if (!currentFavorites.find(fav => fav.id === disaster.id)) {
      const updatedFavorites = [...currentFavorites, disaster];
      await setDoc(userRef, { favorites: updatedFavorites }, { merge: true });
      return updatedFavorites;
    }
    return currentFavorites;
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (userId, disasterId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const currentFavorites = userDoc.data()?.favorites || [];
    
    const updatedFavorites = currentFavorites.filter(fav => fav.id !== disasterId);
    await setDoc(userRef, { favorites: updatedFavorites }, { merge: true });
    return updatedFavorites;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data()?.favorites || [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};