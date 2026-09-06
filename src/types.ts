export type MemberRole = 'member' | 'mentor' | 'coordinator' | 'admin';
export type MemberStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface Member {
  uid: string;
  email: string;
  displayName: string;
  name?: string; // Compatibility
  photoURL?: string;
  role: MemberRole;
  status: MemberStatus;
  bio?: string;
  headline?: string;
  skills?: string[];
  interests?: string[];
  region?: string;
  directoryVisible: boolean;
  totalApprovedMinutes: number;
  joinedAt: Date;
  updatedAt?: Date;
  applicationNotes?: string;
  hasCrown?: boolean;
  customBadge?: string;
  linkedinURL?: string;
}

export interface PublicMemberProfile {
  uid: string;
  displayName: string;
  name?: string; // Compatibility
  photoURL?: string;
  role?: MemberRole;
  status?: MemberStatus;
  bio?: string;
  headline?: string;
  skills?: string[];
  interests?: string[];
  region?: string;
  directoryVisible: boolean;
  hasCrown?: boolean;
  customBadge?: string;
  totalApprovedMinutes?: number;
  joinedAt: Date;
  updatedAt?: Date;
  linkedinURL?: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorUID: string;
  authorPhotoUrl?: string;
  authorRole?: MemberRole;
  message: string;
  category: 'General' | 'Announcement' | 'Idea' | 'Help Needed';
  createdAt: Date;
  likesCount: number;
  likes?: number; // Compatibility
  isAnnouncement?: boolean;
}

export interface PostLike {
  uid: string;
  createdAt: Date;
}

export type ActivityDeliveryMode = 'online' | 'in-person' | 'virtual' | 'hybrid';
export type ActivityStatus = 'draft' | 'published' | 'full' | 'completed' | 'cancelled';

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  meetingLink?: string;
  startsAt: Date | string | any;
  endsAt: Date | string | any;
  timeZone: string;
  deliveryMode: ActivityDeliveryMode;
  capacity: number;
  filledSpots: number;
  status: ActivityStatus;
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  updatedAt?: Date;
  // Compatibility fields for legacy tasks:
  spotsTotal?: number;
  spotsFilled?: number;
  date?: string;
  time?: string;
}

export interface ActivitySignup {
  userId: string;
  signedUpAt: Date;
  // Resolved safe public profile fields (not stored in raw signup doc)
  userName?: string;
  userPhotoURL?: string;
  userBadge?: string;
  userRole?: string;
}

// Backward compatibility aliases
export type Task = Activity;
export type TaskSignup = ActivitySignup;

export type ResourceCategory = 'Study Aid' | 'Worksheets' | 'Volunteering Guide' | 'Event Template' | 'Educational Link' | 'Other';
export type ResourceStatus = 'pending' | 'approved' | 'rejected' | 'removed';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  url: string;
  status?: ResourceStatus;
  creatorId: string;
  creatorName: string;
  creatorRole?: string;
  submittedAt?: Date;
  createdAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export type VolunteerActivityType = 
  | 'Tutoring & Academic Mentorship'
  | 'Workshop & Event Coordination'
  | 'Content & Study Resource Creation'
  | 'Community Outreach & Translation'
  | 'Administrative & Peer Review'
  | 'Other Volunteering Service';

export type HourLogStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface VolunteerHourLog {
  id: string;
  userId: string;
  memberId?: string;
  userName: string;
  userEmail?: string;
  userPhotoURL?: string;
  minutes: number; // Integer minutes
  hours?: number; // Computed / backwards-compatible float hours
  date?: string;
  activityDate?: string;
  activityType?: VolunteerActivityType;
  description: string;
  taskId?: string;
  evidence?: string;
  status?: HourLogStatus;
  submittedAt?: Date;
  createdAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNote?: string;
}

export interface EssayReview {
  id: string;
  studentUID: string;
  studentName: string;
  targetProgram?: string;
  essayType: string;
  status: 'draft' | 'pending_assignment' | 'in_review' | 'completed';
  assignedReviewerUID?: string;
  submittedAt: Date;
}

export interface Credential {
  id: string;
  recipientUID: string;
  recipientName: string;
  title: string;
  approvedMinutes: number;
  issuedAt: Date;
  status: 'active' | 'revoked';
}

export interface Setting {
  teamLogo?: string;
  wideIdentityBanner?: string;
  updatedAt?: Date;
}

export interface PublicAssetDoc {
  assetKey: string;
  imageUrl: string;
  storagePath: string;
  altText: string;
  updatedAt: any;
  updatedBy: string;
}
