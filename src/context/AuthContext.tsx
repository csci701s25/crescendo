import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// This would be imported from your constants or config file
const API_BASE_URL = 'http://localhost:3001';

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
  login: (userData: any) => void;
  logout: () => void;
  refreshTokenIfNeeded: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<Date | null>(null);

  // Check if we have auth data in storage on app load
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const authDataStr = await AsyncStorage.getItem('auth_data');

        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          const expiresAt = new Date(authData.tokenExpiresAt);

          // Check if token is expired
          if (expiresAt > new Date()) {
            // Token is still valid
            setIsAuthenticated(true);
            setUser(authData.user);
            setAccessToken(authData.accessToken);
            setRefreshToken(authData.refreshToken);
            setTokenExpiresAt(expiresAt);
          } else {
            // Token expired, try to refresh
            const newToken = await refreshAccessToken(authData.refreshToken);

            if (newToken) {
              // Successfully refreshed
              setIsAuthenticated(true);
            } else {
              // Failed to refresh, clear data
              clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
        clearAuthData();
      }
    };

    loadAuthData();
  }, []);

  const refreshAccessToken = async (token: string): Promise<string | null> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/spotify/refresh`,
        {
          refreshToken: token,
        },
      );

      if (response.data.success) {
        const {accessToken: newAccessToken, expiresIn} = response.data.data;

        // Calculate new expiration time
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

        setAccessToken(newAccessToken);
        setTokenExpiresAt(expiresAt);

        // Update storage
        const authData = {
          user,
          accessToken: newAccessToken,
          refreshToken,
          tokenExpiresAt: expiresAt.toISOString(),
        };

        await AsyncStorage.setItem('auth_data', JSON.stringify(authData));

        return newAccessToken;
      }

      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  };

  const login = async (userData: any) => {
    try {
      const {profile, tokens} = userData;

      // Calculate token expiry time
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expiresIn);

      // Update state
      setIsAuthenticated(true);
      setUser(profile);
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setTokenExpiresAt(expiresAt);

      // Save to storage
      const authData = {
        user: profile,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: expiresAt.toISOString(),
      };

      await AsyncStorage.setItem('auth_data', JSON.stringify(authData));
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  };

  const logout = async () => {
    clearAuthData();
    await AsyncStorage.removeItem('auth_data');
  };

  const clearAuthData = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setTokenExpiresAt(null);
  };

  const refreshTokenIfNeeded = async (): Promise<string | null> => {
    // If token expired or will expire in the next 5 minutes
    const fiveMinFromNow = new Date();
    fiveMinFromNow.setMinutes(fiveMinFromNow.getMinutes() + 5);

    if (!tokenExpiresAt || tokenExpiresAt < fiveMinFromNow) {
      if (refreshToken) {
        return await refreshAccessToken(refreshToken);
      }
      return null;
    }

    return accessToken;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        login,
        logout,
        refreshTokenIfNeeded,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
