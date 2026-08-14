import React, { useEffect, useState, useCallback } from 'react';
import { Member, MemberContextType } from './types';
import { MemberContext, useMemberContext } from './providers/MemberContext';
import wixClient from '@/wixClient';

/**
 * MemberProvider component that wraps the app and provides member context
 */
export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadCurrentMember = useCallback(async () => {
    try {
      setIsLoading(true);
      // Check if user is authenticated by looking for tokens
      if (wixClient.auth.loggedIn()) {
        const response = await wixClient.members.getCurrentMember({
          fieldsets: ['FULL' as any]
        });
        const currentMember = response.member as unknown as Member;
        
        setMember(currentMember || null);
        setIsAuthenticated(!!currentMember);
      } else {
        setMember(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to load current member:', error);
      setMember(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load current member on mount
  useEffect(() => {
    loadCurrentMember();
  }, [loadCurrentMember]);

  const login = useCallback(async () => {
    try {
      // 1. Generate OAuth data to secure the login process
      const redirectUrl = `${window.location.origin}/login-callback`;
      const data = wixClient.auth.generateOAuthData(redirectUrl, window.location.href);
      
      // 2. Save state temporarily so the callback can verify it
      localStorage.setItem('wix_oauth_data', JSON.stringify(data));
      
      // 3. Get the secure Wix login URL and redirect the user
      const { authUrl } = await wixClient.auth.getAuthUrl(data);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate login:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clear local state first
      localStorage.removeItem('wix_tokens');
      setMember(null);
      setIsAuthenticated(false);
      
      // Generate Wix logout URL and redirect
      const { logoutUrl } = await wixClient.auth.logout(window.location.origin);
      window.location.href = logoutUrl;
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }, []);

  const clearMember = useCallback(() => {
    setMember(null);
    setIsAuthenticated(false);
    localStorage.removeItem('wix_tokens');
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
