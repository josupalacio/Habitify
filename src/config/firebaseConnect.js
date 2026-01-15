import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";
import Swal from 'sweetalert2';

export class ManageAccount {
  async register(email, password, nickname) { 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Guardar información inicial en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        nickname: nickname || user.email.split('@')[0],
        createdAt: new Date().toISOString(),
        name: "",
        avatar: "",
        bio: "",
        status: ""
      });
      
      return { success: true, user };
    } catch (error) {
      let friendlyErrorMessage = "";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          friendlyErrorMessage = 'Este correo ya está registrado.';
          break;
        case 'auth/weak-password':
          friendlyErrorMessage = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        case 'auth/invalid-email':
          friendlyErrorMessage = 'El formato del correo electrónico no es válido.';
          break;
        default:
          friendlyErrorMessage = error.message || 'Error al registrar. Intenta de nuevo.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
        text: friendlyErrorMessage,
      });
      
      return { success: false, message: friendlyErrorMessage };
    }
  }

  async authenticate(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let friendlyErrorMessage = "";
      
      switch (error.code) {
        case 'auth/wrong-password':
          friendlyErrorMessage = 'La contraseña es incorrecta.';
          break;
        case 'auth/user-not-found':
          friendlyErrorMessage = 'No existe cuenta con este correo.';
          break;
        case 'auth/invalid-email':
          friendlyErrorMessage = 'El formato del correo no es válido.';
          break;
        case 'auth/user-disabled':
          friendlyErrorMessage = 'Tu cuenta ha sido deshabilitada.';
          break;
        default:
          friendlyErrorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
      }
      
      return { success: false, message: friendlyErrorMessage };
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      return { success: false, message: error.message };
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      let friendlyErrorMessage = "Error al enviar el correo de recuperación.";
      
      if (error.code === "auth/user-not-found") {
        friendlyErrorMessage = "No existe una cuenta con ese correo.";
      }
      
      return { success: false, message: friendlyErrorMessage };
    }
  }

  async saveData(collection, documentId, data) {
    try {
      await setDoc(doc(db, collection, documentId), data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error al guardar datos:", error.message);
      return { success: false, message: error.message };
    }
  }

  async getUserData(uid) {
    if (!uid) return null;
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return userDocSnap.data();
      } else {
        console.warn("No user data found in Firestore for uid:", uid);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
  }
}
