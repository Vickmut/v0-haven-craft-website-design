"use client"

// Firebase configuration with validation
const firebaseConfig = {
  apiKey: "AIzaSyApXzS64FTx6pflHS-dbL8WKL3u6Mm0Tko",
  authDomain: "havencrafts-767c7.firebaseapp.com",
  projectId: "havencrafts-767c7",
  storageBucket: "havencrafts-767c7.firebasestorage.app",
  messagingSenderId: "136884153755",
  appId: "1:136884153755:web:26d8f25837f97e297d053e",
  measurementId: "G-5JQQZY55V0",
}

// Validate configuration
const isConfigValid = () => {
  return firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
}

// Initialize Firebase with better error handling
let firebaseApp: any = null
let auth: any = null
let db: any = null
let isInitialized = false

const initializeFirebase = async () => {
  if (typeof window === "undefined" || isInitialized) {
    return { auth, db }
  }

  try {
    if (!isConfigValid()) {
      throw new Error("Invalid Firebase configuration")
    }

    // Dynamic imports to avoid SSR issues
    const { initializeApp, getApps, getApp } = await import("firebase/app")
    const { getAuth, connectAuthEmulator } = await import("firebase/auth")
    const { getFirestore, connectFirestoreEmulator } = await import("firebase/firestore")

    // Initialize app
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()

    // Initialize services
    auth = getAuth(firebaseApp)
    db = getFirestore(firebaseApp)

    // Connect to emulators in development
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      try {
        // Only connect if not already connected
        if (!auth._delegate._config.emulator) {
          connectAuthEmulator(auth, "http://localhost:9099")
        }
        if (!db._delegate._databaseId.projectId.includes("demo-")) {
          connectFirestoreEmulator(db, "localhost", 8080)
        }
      } catch (error) {
        // Emulator connection failed, continue with production
        console.log("Emulator connection failed, using production Firebase")
      }
    }

    isInitialized = true
    console.log("Firebase initialized successfully")

    return { auth, db }
  } catch (error) {
    console.error("Firebase initialization failed:", error)
    isInitialized = false
    return { auth: null, db: null }
  }
}

export const getFirebaseServices = async () => {
  if (!isInitialized) {
    return await initializeFirebase()
  }
  return { auth, db }
}

export const signInWithGoogle = async () => {
  if (typeof window === "undefined") {
    throw new Error("Sign in only available on client side")
  }

  try {
    const { auth } = await getFirebaseServices()

    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    // Dynamic import of auth functions
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
    const { doc, setDoc, getDoc } = await import("firebase/firestore")

    const googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({
      prompt: "select_account",
    })

    console.log("Attempting Google sign in...")
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    console.log("Google sign in successful:", user.uid)

    // Create user document if Firestore is available
    if (db) {
      try {
        const userDoc = doc(db, "users", user.uid)
        const userSnap = await getDoc(userDoc)

        if (!userSnap.exists()) {
          await setDoc(userDoc, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            wishlist: [],
            createdAt: new Date(),
          })
          console.log("User document created")
        }
      } catch (firestoreError) {
        console.error("Firestore operation failed:", firestoreError)
        // Continue without Firestore - user can still sign in
      }
    }

    return user
  } catch (error: any) {
    console.error("Google sign in error:", error)

    // Handle specific Firebase errors
    if (error.code === "auth/unauthorized-domain") {
      throw new Error("This domain is not authorized for Google sign-in.")
    } else if (error.code === "auth/configuration-not-found") {
      throw new Error("Authentication service is temporarily unavailable.")
    } else if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign in was cancelled.")
    } else if (error.code === "auth/popup-blocked") {
      throw new Error("Pop-up was blocked by your browser. Please allow pop-ups and try again.")
    } else if (error.code === "auth/network-request-failed") {
      throw new Error("Network error. Please check your connection.")
    }

    throw error
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  if (typeof window === "undefined") {
    throw new Error("Sign in only available on client side")
  }

  try {
    const { auth } = await getFirebaseServices()

    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    const { signInWithEmailAndPassword } = await import("firebase/auth")
    const { doc, setDoc, getDoc } = await import("firebase/firestore")

    console.log("Attempting email sign in...")
    const result = await signInWithEmailAndPassword(auth, email, password)
    const user = result.user

    console.log("Email sign in successful:", user.uid)

    // Create user document if Firestore is available
    if (db) {
      try {
        const userDoc = doc(db, "users", user.uid)
        const userSnap = await getDoc(userDoc)

        if (!userSnap.exists()) {
          await setDoc(userDoc, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || email,
            photoURL: user.photoURL,
            wishlist: [],
            createdAt: new Date(),
          })
          console.log("User document created")
        }
      } catch (firestoreError) {
        console.error("Firestore operation failed:", firestoreError)
      }
    }

    return user
  } catch (error: any) {
    console.error("Email sign in error:", error)

    if (error.code === "auth/user-not-found") {
      throw new Error("Email not found. Please sign up first.")
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password.")
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.")
    }

    throw error
  }
}

export const signUpWithEmail = async (email: string, password: string) => {
  if (typeof window === "undefined") {
    throw new Error("Sign up only available on client side")
  }

  try {
    const { auth } = await getFirebaseServices()

    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    const { createUserWithEmailAndPassword } = await import("firebase/auth")
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")

    console.log("Attempting email sign up...")
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user

    console.log("Email sign up successful:", user.uid)

    // Create user document
    if (db) {
      try {
        const userDoc = doc(db, "users", user.uid)
        await setDoc(userDoc, {
          uid: user.uid,
          email: user.email,
          displayName: email.split("@")[0],
          photoURL: null,
          wishlist: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        console.log("User document created")
      } catch (firestoreError) {
        console.error("Firestore operation failed:", firestoreError)
      }
    }

    return user
  } catch (error: any) {
    console.error("Email sign up error:", error)

    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use. Please sign in instead.")
    } else if (error.code === "auth/weak-password") {
      throw new Error("Password must be at least 6 characters.")
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.")
    }

    throw error
  }
}

export const signOutUser = async () => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const { auth } = await getFirebaseServices()
    if (!auth) return

    const { signOut } = await import("firebase/auth")
    await signOut(auth)
    console.log("User signed out successfully")
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const addToWishlist = async (userId: string, itemId: string) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const { db } = await getFirebaseServices()
    if (!db) {
      throw new Error("Database not available")
    }

    const { doc, updateDoc, arrayUnion, setDoc, getDoc, serverTimestamp } = await import("firebase/firestore")
    const userDoc = doc(db, "users", userId)

    try {
      // Check if user document exists, create if not
      const userSnap = await getDoc(userDoc)
      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          uid: userId,
          wishlist: [itemId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        console.log("User document created with wishlist item:", itemId)
      } else {
        await updateDoc(userDoc, {
          wishlist: arrayUnion(itemId),
          updatedAt: serverTimestamp(),
        })
        console.log("Item added to wishlist:", itemId)
      }
    } catch (firestoreError: any) {
      console.error("Firestore error:", firestoreError)

      // Handle specific Firestore errors
      if (firestoreError.code === "permission-denied") {
        throw new Error("Permission denied. Please check your authentication status.")
      } else if (firestoreError.code === "unavailable") {
        throw new Error("Service temporarily unavailable. Please try again later.")
      } else if (firestoreError.code === "failed-precondition") {
        throw new Error("Database operation failed. Please try again.")
      }

      throw new Error("Failed to update wishlist. Please try again.")
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw error
  }
}

export const removeFromWishlist = async (userId: string, itemId: string) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const { db } = await getFirebaseServices()
    if (!db) {
      throw new Error("Database not available")
    }

    const { doc, updateDoc, arrayRemove, serverTimestamp } = await import("firebase/firestore")
    const userDoc = doc(db, "users", userId)

    try {
      await updateDoc(userDoc, {
        wishlist: arrayRemove(itemId),
        updatedAt: serverTimestamp(),
      })
      console.log("Item removed from wishlist:", itemId)
    } catch (firestoreError: any) {
      console.error("Firestore error:", firestoreError)

      if (firestoreError.code === "permission-denied") {
        throw new Error("Permission denied. Please check your authentication status.")
      } else if (firestoreError.code === "unavailable") {
        throw new Error("Service temporarily unavailable. Please try again later.")
      }

      throw new Error("Failed to update wishlist. Please try again.")
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    throw error
  }
}

export const getUserWishlist = async (userId: string) => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const { db } = await getFirebaseServices()
    if (!db) {
      console.warn("Database not available")
      return []
    }

    const { doc, getDoc } = await import("firebase/firestore")
    const userDoc = doc(db, "users", userId)

    try {
      const userSnap = await getDoc(userDoc)

      if (userSnap.exists()) {
        const wishlist = userSnap.data().wishlist || []
        console.log("Retrieved Firebase wishlist:", wishlist)
        return wishlist
      }
      return []
    } catch (firestoreError: any) {
      console.error("Firestore error:", firestoreError)

      if (firestoreError.code === "permission-denied") {
        console.warn("Permission denied reading wishlist")
        return []
      }

      return []
    }
  } catch (error) {
    console.error("Error getting wishlist:", error)
    return []
  }
}

// New function to update item discount with Firebase real-time sync
export const updateItemDiscount = async (itemId: string, discount: number) => {
  if (typeof window === "undefined") {
    throw new Error("Item update only available on client side")
  }

  try {
    const { db } = await getFirebaseServices()

    if (!db) {
      throw new Error("Database not available")
    }

    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

    const itemRef = doc(db, "items", itemId)

    await updateDoc(itemRef, {
      discount: discount,
      discountedPrice: discount > 0 ? discount : null,
      updatedAt: serverTimestamp(),
    })

    console.log("Item discount updated successfully:", itemId, "Discount:", discount)
    return true
  } catch (error: any) {
    console.error("Error updating item discount:", error)

    if (error.code === "permission-denied") {
      throw new Error("Permission denied. Only admins can update discounts.")
    } else if (error.code === "not-found") {
      throw new Error("Item not found.")
    } else if (error.code === "unavailable") {
      throw new Error("Service temporarily unavailable. Please try again later.")
    }

    throw error
  }
}

// New function to add listener for real-time item updates across all devices
export const subscribeToItemUpdates = (itemId: string, callback: (item: any) => void) => {
  if (typeof window === "undefined") {
    return () => {} // Return dummy unsubscribe for SSR
  }

  try {
    const { db } = getFirebaseServices()

    if (!db) {
      console.warn("Database not available for real-time updates")
      return () => {}
    }

    // Dynamic import of snapshot listener
    import("firebase/firestore").then(({ doc, onSnapshot }) => {
      const itemRef = doc(db, "items", itemId)

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        itemRef,
        (snapshot) => {
          if (snapshot.exists()) {
            console.log("Real-time item update received:", snapshot.data())
            callback(snapshot.data())
          }
        },
        (error) => {
          console.error("Error listening to item updates:", error)
        },
      )

      return unsubscribe
    })

    // Return empty function if async import hasn't completed
    return () => {}
  } catch (error) {
    console.error("Error setting up item listener:", error)
    return () => {}
  }
}

// Export auth and db for backward compatibility
export { auth, db }
