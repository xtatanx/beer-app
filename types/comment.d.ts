export type CommentResponse = {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  images: string[];
  value: 4;
  comment: string;
  createdAt: string;
};
