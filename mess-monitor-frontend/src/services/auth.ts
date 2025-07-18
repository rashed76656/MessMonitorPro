import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserByUid, createUserProfile } from "./firestore";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'border';
  adminSecret?: string;
}

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userProfile = await getUserByUid(userCredential.user.uid);
    return { user: userCredential.user, profile: userProfile };
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

export const register = async (data: RegisterData) => {
  try {
    // Validate admin secret if role is admin
    if (data.role === 'admin') {
      const isValidSecret = await validateAdminSecret(data.adminSecret || '');
      if (!isValidSecret) {
        throw new Error('Invalid admin secret key');
      }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const userProfile = await createUserProfile({
      uid: userCredential.user.uid,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role
    });

    return { user: userCredential.user, profile: userProfile };
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Logout failed');
  }
};

const validateAdminSecret = async (secret: string): Promise<boolean> => {
  // Import here to avoid circular dependency
  const { getConfig } = await import("./firestore");
  try {
    const config = await getConfig();
    return config?.adminKey === secret;
  } catch (error) {
    return false;
  }
};
