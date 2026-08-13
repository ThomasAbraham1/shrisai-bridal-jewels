import React from 'react';
import { Member, MemberContextType } from '../types';

export const MemberContext = React.createContext<MemberContextType | undefined>(undefined);

export function useMemberContext() {
  const context = React.useContext(MemberContext);
  if (!context) {
    throw new Error('useMemberContext must be used within MemberProvider');
  }
  return context;
}
