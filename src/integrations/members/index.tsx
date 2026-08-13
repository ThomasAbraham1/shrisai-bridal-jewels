import React, { useEffect, useState, useCallback } from 'react';
import { Member, MemberContextType } from './types';
import { MemberContext, useMemberContext } from './providers/MemberContext';

/**
 * MemberProvider component that wraps the app and provides member context
 */
export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load current member on mount
  useEffect(() => {
    const loadMember = async () => {
      try {
        setIsLoading(true);
        // Check if user is authenticated by looking for member data
        // This would be implemented with actual Wix Members API
        setMember(null);
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Failed to load member:', error);
        setMember(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadMember();
  }, []);

  const loadCurrentMember = useCallback(async () => {
    try {
      setIsLoading(true);
      // This would be implemented with actual Wix Members API
      setMember(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to load current member:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(() => {
    // Redirect to login page
    window.location.href = '/api/auth/login';
  }, []);

  const logout = useCallback(() => {
    // Redirect to logout page
    window.location.href = '/api/auth/logout';
  }, []);

  const clearMember = useCallback(() => {
    setMember(null);
    setIsAuthenticated(false);
  }, []);

  const value: MemberContextType = {
    member,
    isAuthenticated,
    isLoading,
    actions: {
      loadCurrentMember,
      login,
      logout,
      clearMember,
    },
  };

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
}

/**
 * Hook to use member context
 */
export function useMember() {
  return useMemberContext();
}

export type { Member } from './types';
