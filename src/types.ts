export interface Post {
  id: string;
  authorName: string;
  authorUID: string;
  authorPhotoUrl: string;
  message: string;
  category: "General" | "Announcement" | "Idea" | "Help Needed";
  createdAt: Date; // Transformed from Firestore Timestamp
  likesCount: number;
  likes: string[]; // List of user UIDs
}

export interface Task {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  spotsTotal: number;
  spotsFilled: number;
  creatorId: string;
  creatorName: string;
  createdAt: Date; // Transformed from Firestore Timestamp
}

export interface TaskSignup {
  userId: string;
  userName: string;
  userEmail: string;
  signedUpAt: Date; // Transformed from Firestore Timestamp
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: "Study Aid" | "Worksheets" | "Volunteering Guide" | "Event Template" | "Educational Link" | "Other";
  url: string;
  creatorId: string;
  creatorName: string;
  creatorRole?: string;
  createdAt: Date;
}

export interface VolunteerHourLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhotoURL?: string;
  hours: number;
  date: string;
  description: string;
  createdAt: Date;
}

