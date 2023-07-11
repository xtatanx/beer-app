export type UserResponse = {
  _id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  bio: string;
  profileImage: string;
  emailVerified: null;
  linkedAccounts: string[];
};

export type UpdateFields = Partial<
  Omit<UserResponse, '_id' | 'emailVerified' | 'linkedAccounts'>
>;
