import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, FundTransaction, Config, Fine, Notification, Announcement, Feedback } from "@/types";

// User operations
export const getUserByUid = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() as User : null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const createUserProfile = async (userData: Partial<User> & { uid: string }): Promise<User> => {
  try {
    const userProfile = {
      uid: userData.uid,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'border',
      joinDate: new Date().toISOString().split('T')[0],
      fines: []
    };

    // Add border-specific fields only for borders
    if (userData.role === 'border') {
      Object.assign(userProfile, {
        department: userData.department || 'Not specified',
        duty: userData.duty || 'Not assigned',
        owesTo: userData.owesTo || [],
        getsFrom: userData.getsFrom || [],
        monthlyContribution: userData.monthlyContribution || 0,
        lastPayment: userData.lastPayment || null
      });
    }
    
    await setDoc(doc(db, 'users', userData.uid), userProfile);
    return userProfile as User;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getBorders = async (): Promise<User[]> => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'border'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error getting borders:', error);
    throw error;
  }
};

// Fund operations
export const getFundTransactions = async (): Promise<FundTransaction[]> => {
  try {
    const q = query(collection(db, 'mess_funds'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FundTransaction));
  } catch (error) {
    console.error('Error getting fund transactions:', error);
    throw error;
  }
};

export const addFundTransaction = async (transaction: Omit<FundTransaction, 'id' | 'timestamp'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'mess_funds'), {
      ...transaction,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding fund transaction:', error);
    throw error;
  }
};

export const updateFundTransaction = async (id: string, updates: Partial<FundTransaction>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'mess_funds', id), updates);
  } catch (error) {
    console.error('Error updating fund transaction:', error);
    throw error;
  }
};

export const deleteFundTransaction = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'mess_funds', id));
  } catch (error) {
    console.error('Error deleting fund transaction:', error);
    throw error;
  }
};

// Config operations
export const getConfig = async (): Promise<Config | null> => {
  try {
    const configDoc = await getDoc(doc(db, 'config', 'secrets'));
    return configDoc.exists() ? configDoc.data() as Config : null;
  } catch (error) {
    console.error('Error getting config:', error);
    throw error;
  }
};

// Real-time listeners
export const listenToFundTransactions = (callback: (transactions: FundTransaction[]) => void) => {
  const q = query(collection(db, 'mess_funds'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FundTransaction));
    callback(transactions);
  });
};

export const listenToBorders = (callback: (borders: User[]) => void) => {
  const q = query(collection(db, 'users'), where('role', '==', 'border'));
  return onSnapshot(q, (querySnapshot) => {
    const borders = querySnapshot.docs.map(doc => doc.data() as User);
    callback(borders);
  });
};

// Announcement operations
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Announcement));
  } catch (error) {
    console.error('Error getting announcements:', error);
    throw error;
  }
};

export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'timestamp'>): Promise<string> => {
  try {
    if (!announcement.title || !announcement.content || !announcement.createdBy) {
      throw new Error('Missing required fields for announcement');
    }
    
    const docRef = await addDoc(collection(db, 'announcements'), {
      ...announcement,
      timestamp: serverTimestamp()
    });
    
    // Create notifications for all borders
    try {
      const borders = await getBorders();
      if (borders.length > 0) {
        const notifications = borders.map(border => ({
          title: 'New Announcement',
          message: announcement.title,
          type: 'announcement' as const,
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: announcement.createdBy,
          isRead: false,
          borderUid: border.uid
        }));
        
        // Add notifications with error handling for each
        await Promise.allSettled(notifications.map(notification => 
          addDoc(collection(db, 'notifications'), {
            ...notification,
            timestamp: serverTimestamp()
          })
        ));
      }
    } catch (notificationError) {
      console.error('Error creating notifications for announcement:', notificationError);
      // Don't throw here - announcement was created successfully
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding announcement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

// Notification operations
export const getNotificationsByUser = async (borderUid: string): Promise<Notification[]> => {
  try {
    if (!borderUid) {
      console.warn('No borderUid provided for notifications');
      return [];
    }
    
    const q = query(
      collection(db, 'notifications'), 
      where('borderUid', '==', borderUid),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
  } catch (error) {
    console.error('Error getting notifications:', error);
    return []; // Return empty array instead of throwing to prevent UI crashes
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      isRead: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Feedback operations
export const getFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const q = query(collection(db, 'feedbacks'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Feedback));
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    throw error;
  }
};

export const addFeedback = async (feedback: Omit<Feedback, 'id' | 'timestamp'>): Promise<string> => {
  try {
    if (!feedback.message || !feedback.submittedBy || feedback.rating === undefined) {
      throw new Error('Missing required fields for feedback');
    }
    
    if (feedback.rating < 1 || feedback.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    const docRef = await addDoc(collection(db, 'feedbacks'), {
      ...feedback,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding feedback:', error);
    throw error;
  }
};

export const updateFeedback = async (id: string, updates: Partial<Feedback>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'feedbacks', id), updates);
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw error;
  }
};

// Real-time listeners for new features
export const listenToAnnouncements = (callback: (announcements: Announcement[]) => void) => {
  const q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const announcements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Announcement));
    callback(announcements);
  });
};

export const listenToNotifications = (borderUid: string, callback: (notifications: Notification[]) => void) => {
  if (!borderUid) {
    console.warn('No borderUid provided for notification listener');
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
  
  const q = query(
    collection(db, 'notifications'), 
    where('borderUid', '==', borderUid),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    try {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      callback(notifications);
    } catch (error) {
      console.error('Error processing notifications:', error);
      callback([]); // Provide fallback empty array
    }
  }, (error) => {
    console.error('Error in notifications listener:', error);
    callback([]); // Provide fallback on error
  });
};

export const listenToFeedbacks = (callback: (feedbacks: Feedback[]) => void) => {
  const q = query(collection(db, 'feedbacks'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const feedbacks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Feedback));
    callback(feedbacks);
  });
};
