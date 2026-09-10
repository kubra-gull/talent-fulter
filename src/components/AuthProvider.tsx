import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk
} from '@clerk/clerk-react';

// Dedicated Clerk publishable key provided by user
const CLERK_PUBLISHABLE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY) ||
  'pk_test_anVzdC1tYW5hdGVlLTkyLmNsZXJrLmFjY291bnRzLmRldiQ';

export interface AppAuthContextType {
  role: 'candidate' | 'hr';
  setRole: (role: 'candidate' | 'hr') => void;
  activeCandidateId: string | null;
  setActiveCandidateId: (id: string | null) => void;
  activeCandidateName: string;
  setActiveCandidateName: (name: string) => void;
  user: ReturnType<typeof useUser>['user'];
  isSignedIn: boolean;
  isLoaded: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AppAuthContextType>({
  role: 'candidate',
  setRole: () => {},
  activeCandidateId: null,
  setActiveCandidateId: () => {},
  activeCandidateName: '',
  setActiveCandidateName: () => {},
  user: null,
  isSignedIn: false,
  isLoaded: true,
  signOut: async () => {}
});

export const useAppAuth = () => useContext(AuthContext);

// Internal sync component that connects Clerk user session to Talent Filter state
const ClerkStateBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const clerk = useClerk();

  const [role, setRole] = useState<'candidate' | 'hr'>(() => {
    try {
      const savedRole = localStorage.getItem('talent_filter_role');
      if (savedRole === 'hr' || savedRole === 'candidate') return savedRole;
    } catch {}
    return 'candidate';
  });

  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);
  const [activeCandidateName, setActiveCandidateName] = useState<string>('');

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        const displayName =
          user.fullName ||
          `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          user.primaryEmailAddress?.emailAddress ||
          'Candidate';
        setActiveCandidateId(user.id);
        setActiveCandidateName(displayName);
      } else {
        setActiveCandidateId(null);
        setActiveCandidateName('');
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSetRole = (newRole: 'candidate' | 'hr') => {
    setRole(newRole);
    try {
      localStorage.setItem('talent_filter_role', newRole);
    } catch {}
  };

  const handleSignOut = async () => {
    await clerk.signOut();
    setActiveCandidateId(null);
    setActiveCandidateName('');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole: handleSetRole,
        activeCandidateId,
        setActiveCandidateId,
        activeCandidateName,
        setActiveCandidateName,
        user: user || null,
        isSignedIn: Boolean(isSignedIn),
        isLoaded: Boolean(isLoaded),
        signOut: handleSignOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <ClerkStateBridge>{children}</ClerkStateBridge>
    </ClerkProvider>
  );
};

// Pure Clerk Component exports directly from @clerk/clerk-react
export {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk
};
