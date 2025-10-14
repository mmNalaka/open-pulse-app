export type Invitation = {
  id: string;
  organizationId: string;
  email: string;
  role: 'member' | 'admin' | 'owner';
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  inviterId: string;
  expiresAt: Date;
  createdAt?: Date; // Optional since API doesn't provide it
  invitedBy?: {
    name: string;
    email: string;
  };
};

export type Member = {
  id: string;
  userId: string;
  role: string;
  status?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | undefined; // Standardize to undefined instead of null
  };
  createdAt: Date;
};
