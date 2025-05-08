
interface GoogleUser {
  name: string;
  email: string;
  picture?: string;
}

let currentUser: GoogleUser | null = null;
let authListeners: ((user: GoogleUser | null) => void)[] = [];

export const googleAuth = {
  // Set current user and notify listeners
  setUser: (user: GoogleUser | null) => {
    currentUser = user;
    // Store user in localStorage for persistence
    if (user) {
      localStorage.setItem('vzee_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vzee_user');
    }
    // Notify listeners
    authListeners.forEach(listener => listener(user));
  },

  // Get current user
  getUser: (): GoogleUser | null => {
    // If we have a current user, return it
    if (currentUser) return currentUser;
    
    // Try to get from localStorage
    const storedUser = localStorage.getItem('vzee_user');
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
        return currentUser;
      } catch (e) {
        localStorage.removeItem('vzee_user');
      }
    }
    
    return null;
  },

  // Sign out
  signOut: () => {
    googleAuth.setUser(null);
  },

  // Subscribe to auth changes
  onAuthChange: (callback: (user: GoogleUser | null) => void) => {
    authListeners.push(callback);
    // Immediately call with current user
    callback(googleAuth.getUser());
    
    // Return unsubscribe function
    return () => {
      authListeners = authListeners.filter(listener => listener !== callback);
    };
  }
};

// Try to load user from localStorage on init
googleAuth.getUser();

export default googleAuth;
