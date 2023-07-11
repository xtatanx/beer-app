declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NEXTAUTH_SECRET: string;
      EMAIL_SERVER: string;
      EMAIL_FROM: string;
      CLOUDINARY_URL: string;
      CLOUDINARY_FOLDER: string;
      NEXT_PUBLIC_CLOUDINARY_IMAGE_PATH: string;
    }
  }
}

export {};
