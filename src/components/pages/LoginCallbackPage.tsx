import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wixClient from '@/wixClient';
import { useMember } from '@/integrations';

export default function LoginCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { actions } = useMember();

  useEffect(() => {
    const handleLoginCallback = async () => {
      try {
        // 1. Retrieve the OAuth data we saved before redirecting
        const oauthDataString = localStorage.getItem('wix_oauth_data');
        if (!oauthDataString) {
          throw new Error('No OAuth data found. Please try logging in again.');
        }

        const oauthData = JSON.parse(oauthDataString);

        // 2. Parse the tokens from the URL that Wix redirected us to
        const { code, state } = wixClient.auth.parseFromUrl(window.location.href, oauthData);
        
        // 3. Exchange the code/state for the actual auth tokens
        const tokens = await wixClient.auth.getMemberTokens(code, state, oauthData);
        
        // 4. Set tokens in client and persist them to local storage
        wixClient.auth.setTokens(tokens);
        localStorage.setItem('wix_tokens', JSON.stringify(tokens));
        
        // Clean up temporary OAuth data
        localStorage.removeItem('wix_oauth_data');

        // 5. Load the member data into our global context
        await actions.loadCurrentMember();

        // 6. Redirect back to where they were, or home page
        const redirectUrl = oauthData.originalUri || '/';
        navigate(new URL(redirectUrl).pathname || '/');
        
      } catch (err: any) {
        console.error('Login callback error:', err);
        setError(err.message || 'An error occurred during login verification.');
      }
    };

    handleLoginCallback();
  }, [navigate, actions]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-heading text-red-600 mb-4">Login Failed</h1>
        <p className="text-secondary/70 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-sm"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-heading text-secondary animate-pulse">Securing your session...</h2>
    </div>
  );
}
