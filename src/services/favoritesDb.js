
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'favorites';
const favoritesCollection = collection(db, COLLECTION_NAME);

export async function createFavorite(picture) {
    const newFavorite = {
        nasaId: picture.nasaId,
        date: picture.date,
        title: picture.title,
        url: picture.url,
        description: picture.description,
        credit: picture.credit,
        aspectRatio: picture.aspectRatio,
        savedAt: Date.now(),
    };

    const docRef = await addDoc(favoritesCollection, newFavorite);

    return { id: docRef.id, ...newFavorite };
}

export async function readFavorites() {
    const newestFirst = query(favoritesCollection, orderBy('savedAt', 'desc'));
    const snapshot = await getDocs(newestFirst);

    return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
    }));
}

export async function deleteFavorite(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}