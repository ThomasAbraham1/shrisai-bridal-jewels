/**
 * Member type definitions for Wix Members
 * Note: const placeholders below are required for ES module runtime resolution.
 * TypeScript interfaces are erased at compile time — the browser needs something real.
 */

// Runtime placeholders (TypeScript will merge these with the interface declarations below)
export const Member = null as unknown as Member;
export const MemberContextType = null as unknown as MemberContextType;

export interface Member {
  loginEmail?: string;
  loginEmailVerified?: boolean;
  status?: 'UNKNOWN' | 'PENDING' | 'APPROVED' | 'BLOCKED' | 'OFFLINE';
  contact?: {
    firstName?: string;
    lastName?: string;
    phones?: string[];
  };
  profile?: {
    nickname?: string;
    photo?: {
      url?: string;
      height?: number;
      width?: number;
      offsetX?: number;
      offsetY?: number;
    };
    title?: string;
  };
  _createdDate?: Date;
  _updatedDate?: Date;
  lastLoginDate?: Date;
}

export interface MemberContextType {
  member: Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  actions: {
    loadCurrentMember: () => Promise<void>;
    login: () => void;
    logout: () => void;
    clearMember: () => void;
  };
}
