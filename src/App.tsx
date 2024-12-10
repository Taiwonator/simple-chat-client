import { initializeApp } from "firebase/app";
import { useState, useEffect } from "react";
import Chat from "./components/widget/Chat";
import Form from "./components/widget/Form";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from "./context/UserContext";
import { User as AppUser, CreateUser, FindOrInsertUser, Login } from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('fireBaseUser', firebaseUser)
      if (firebaseUser) {
        console.log('FirebaseUser is signed in', firebaseUser);
        const appUser = await findOrInsertUser(firebaseUser);
        console.log('appUser', appUser)
        setUser(appUser);
      } else {
        console.log('FirebaseUser is signed out');
        setUser(null);
      }
      console.log('isLoading', isLoading)
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login: Login = (name, avatarSrc) => {
    setIsLoading(true)
    signInAnonymously(auth).then((credentials) => {
      createUser(credentials.user, name, avatarSrc)
      console.log('isLoading', isLoading)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage)
    });
  }

  const logout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    auth.signOut().then(() => {
      setUser(null)
    }).catch((error) => {
      console.error('Error signing out', error)
    });
  }

  const createUser: CreateUser = async (user, name, avatarSrc) => {
    const userRef = doc(db, "users", user.uid);
    const newUser: AppUser = {
      id: user.uid, name,
      avatar: { src: avatarSrc },
    };
    await setDoc(userRef, newUser);
    return newUser;
  }

  const findUserById = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as AppUser;
    } else {
      return null;
    }
  }

  const findOrInsertUser: FindOrInsertUser = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    console.log('userSnap', userSnap)
    if (userSnap.exists()) {
      console.log('userSnap.data()', userSnap.data())
      return userSnap.data() as AppUser;
    } else {
      const newUser = await createUser(user, "Anonymous User", "/avatars/bottts-0.png");
      console.log('newUser', newUser)
      return newUser
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center gap-2 dark:bg-gray-800">
      { isLoading && (
        <div className="flex size-56 items-center justify-center rounded-lg">
            <div role="status">
                <svg aria-hidden="true" className="size-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
      )}
      {!isLoading && (
        <UserContext.Provider value={{
          user,
          logout,
          setUser,
          findUserById
        }}>
          <div className="flex h-svh flex-col items-center gap-2">
            <Chat firebaseApp={firebaseApp} isBlurred={!user}  />
          </div>
        </UserContext.Provider>
      )}
      {!isLoading && !user && <Form login={login} />} 
    </main>
  );
}

export default App;
