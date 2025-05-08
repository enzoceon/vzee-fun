
// Google Authentication configuration
const GOOGLE_CLIENT_ID = "763178151866-bft0v9p1q4vmekfg0btrc4c3isi58r0t.apps.googleusercontent.com";
const GOOGLE_SCOPES = "email profile";

// Interface for Google auth response
interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

// Initialize Google Auth
export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the Google API script is already loaded
    if (document.getElementById("google-auth-script")) {
      resolve();
      return;
    }

    // Create the script element
    const script = document.createElement("script");
    script.id = "google-auth-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google authentication script"));

    // Add the script to the document
    document.head.appendChild(script);
  });
};

// Function to handle Google authentication
export const authenticateWithGoogle = (): Promise<GoogleUser> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error("Google API not loaded"));
      return;
    }

    const handleCredentialResponse = (response: any) => {
      try {
        // Decode the JWT token to get user information
        const decodedToken = decodeJWT(response.credential);
        
        const user: GoogleUser = {
          id: decodedToken.sub,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
        };
        
        // Store user data in localStorage for persistence
        localStorage.setItem('vzeeUser', JSON.stringify(user));
        
        resolve(user);
      } catch (error) {
        console.error('Error processing Google authentication:', error);
        reject(error);
      }
    };

    // Initialize Google One Tap
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
    });

    // Display the Google Sign-In button
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback to render a custom button
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button") || document.createElement("div"),
          { theme: "outline", size: "large", width: 220 }
        );
      }
    });
  });
};

// Function to sign out
export const signOut = (): void => {
  localStorage.removeItem('vzeeUser');
  localStorage.removeItem('vzeeUsername');
  if (window.google) {
    window.google.accounts.id.disableAutoSelect();
    window.google.accounts.id.revoke();
  }
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('vzeeUser') !== null;
};

// Helper to get current user
export const getCurrentUser = (): GoogleUser | null => {
  const userData = localStorage.getItem('vzeeUser');
  return userData ? JSON.parse(userData) : null;
};

// Function to decode JWT token
function decodeJWT(token: string): any {
  try {
    // Extract the payload part of the token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    throw error;
  }
}

// Add TypeScript types for Google global object
declare global {
  interface Window {
    google: any;
  }
}
