export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
}

export interface Invite {
  _id: string; // MongoDB ObjectId
  email: string;
  token: string;
  status: InviteStatus;
  expiresAt: string; // ISO string from backend
  role: string;
  acceptedBy: string | null; // ObjectId as string or null
}

export interface CreateInvitePayload {
  email: string;
  role: string;
}