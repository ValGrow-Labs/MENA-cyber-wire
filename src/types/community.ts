export interface CommunityAuthor {
  name: string;
  handle: string;
  role: string;
  badge?: string;
  verified?: boolean;
  avatar?: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  author: CommunityAuthor;
  timestamp: string;
  content: string;
  upvotes: number;
  downvotes?: number;
  userVote?: "up" | "down" | null;
  parentId?: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  body: string;
  topic: string;
  country: string;
  author: CommunityAuthor;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  userVote?: "up" | "down" | null;
  commentsCount: number;
  tags: string[];
  isPinned?: boolean;
  isDemo?: boolean;
  comments?: CommunityComment[];
}
