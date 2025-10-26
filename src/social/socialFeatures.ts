/**
 * Social & Community System
 * Sharing, profiles, tutorials, community features
 */

export interface SocialPost {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  projectId: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  views: number;
  comments: number;
  shares: number;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  likes: number;
  badges: string[];
  level: number;
  createdAt: Date;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  steps: TutorialStep[];
  tags: string[];
  views: number;
  likes: number;
  author: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action: string;
  highlight?: string;
  videoUrl?: string;
}

/**
 * Social Sharing Manager
 */
export class SocialSharingManager {
  /**
   * Share to Instagram
   */
  async shareToInstagram(videoPath: string, caption: string): Promise<boolean> {
    try {
      console.log('Sharing to Instagram:', videoPath, caption);
      
      // Use expo-sharing or react-native-share
      // await Share.share({
      //   url: videoPath,
      //   message: caption,
      // });

      return true;
    } catch (error) {
      console.error('Instagram share error:', error);
      return false;
    }
  }

  /**
   * Share to TikTok
   */
  async shareToTikTok(videoPath: string, caption: string): Promise<boolean> {
    try {
      console.log('Sharing to TikTok:', videoPath, caption);
      
      // Use TikTok SDK or deep linking
      // const tiktokUrl = `tiktok://shareVideo?url=${encodeURIComponent(videoPath)}`;
      // await Linking.openURL(tiktokUrl);

      return true;
    } catch (error) {
      console.error('TikTok share error:', error);
      return false;
    }
  }

  /**
   * Share to YouTube Shorts
   */
  async shareToYouTubeShorts(videoPath: string, title: string, description: string): Promise<boolean> {
    try {
      console.log('Sharing to YouTube Shorts:', videoPath, title);
      
      // Use YouTube Data API v3 (free with API key limits)
      // For direct upload, use YouTube SDK

      return true;
    } catch (error) {
      console.error('YouTube share error:', error);
      return false;
    }
  }

  /**
   * Share to Twitter
   */
  async shareToTwitter(videoPath: string, text: string): Promise<boolean> {
    try {
      console.log('Sharing to Twitter:', videoPath, text);
      
      // Use react-native-share or Twitter SDK
      // await Share.share({
      //   url: videoPath,
      //   message: text,
      // });

      return true;
    } catch (error) {
      console.error('Twitter share error:', error);
      return false;
    }
  }

  /**
   * Share to Facebook
   */
  async shareToFacebook(videoPath: string, message: string): Promise<boolean> {
    try {
      console.log('Sharing to Facebook:', videoPath, message);
      
      // Use react-native-fbsdk-next or react-native-share
      
      return true;
    } catch (error) {
      console.error('Facebook share error:', error);
      return false;
    }
  }

  /**
   * Export for social media platform
   */
  exportForPlatform(platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'): {
    resolution: { width: number; height: number };
    aspectRatio: string;
    maxDuration: number;
    format: string;
  } {
    const presets = {
      instagram: {
        resolution: { width: 1080, height: 1920 },
        aspectRatio: '9:16',
        maxDuration: 60,
        format: 'mp4',
      },
      tiktok: {
        resolution: { width: 1080, height: 1920 },
        aspectRatio: '9:16',
        maxDuration: 180,
        format: 'mp4',
      },
      youtube: {
        resolution: { width: 1080, height: 1920 },
        aspectRatio: '9:16',
        maxDuration: 60,
        format: 'mp4',
      },
      twitter: {
        resolution: { width: 1280, height: 720 },
        aspectRatio: '16:9',
        maxDuration: 140,
        format: 'mp4',
      },
    };

    return presets[platform];
  }

  /**
   * Generate hashtags
   */
  generateHashtags(projectTags: string[]): string[] {
    const baseHashtags = ['#manga', '#anime', '#amv', '#edit', '#video'];
    return [...baseHashtags, ...projectTags.map(tag => `#${tag.toLowerCase()}`)];
  }
}

/**
 * Community Manager
 */
export class CommunityManager {
  private posts: Map<string, SocialPost> = new Map();
  private users: Map<string, UserProfile> = new Map();

  /**
   * Create post
   */
  async createPost(post: Omit<SocialPost, 'id' | 'createdAt'>): Promise<string> {
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newPost: SocialPost = {
      ...post,
      id: postId,
      createdAt: new Date(),
    };

    this.posts.set(postId, newPost);
    return postId;
  }

  /**
   * Get feed
   */
  async getFeed(userId: string, page: number = 1, limit: number = 20): Promise<SocialPost[]> {
    // In production, fetch from backend
    const allPosts = Array.from(this.posts.values());
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return allPosts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(start, end);
  }

  /**
   * Like post
   */
  async likePost(postId: string, userId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.likes += 1;
      this.posts.set(postId, post);
    }
  }

  /**
   * Comment on post
   */
  async commentOnPost(postId: string, userId: string, comment: string): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.comments += 1;
      this.posts.set(postId, post);
    }
  }

  /**
   * Share post
   */
  async sharePost(postId: string, userId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.shares += 1;
      this.posts.set(postId, post);
    }
  }

  /**
   * Get trending posts
   */
  async getTrendingPosts(limit: number = 10): Promise<SocialPost[]> {
    const allPosts = Array.from(this.posts.values());
    
    return allPosts
      .sort((a, b) => {
        // Calculate trend score based on recent engagement
        const aScore = a.likes + a.comments * 2 + a.shares * 3 + a.views * 0.1;
        const bScore = b.likes + b.comments * 2 + b.shares * 3 + b.views * 0.1;
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  /**
   * Search posts
   */
  async searchPosts(query: string): Promise<SocialPost[]> {
    const allPosts = Array.from(this.posts.values());
    const lowerQuery = query.toLowerCase();
    
    return allPosts.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.users.get(userId) || null;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      this.users.set(userId, { ...user, ...updates });
    }
  }

  /**
   * Follow user
   */
  async followUser(followerId: string, followingId: string): Promise<void> {
    const follower = this.users.get(followerId);
    const following = this.users.get(followingId);

    if (follower && following) {
      follower.following += 1;
      following.followers += 1;
      this.users.set(followerId, follower);
      this.users.set(followingId, following);
    }
  }

  /**
   * Unfollow user
   */
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follower = this.users.get(followerId);
    const following = this.users.get(followingId);

    if (follower && following) {
      follower.following -= 1;
      following.followers -= 1;
      this.users.set(followerId, follower);
      this.users.set(followingId, following);
    }
  }
}

/**
 * Tutorial System
 */
export class TutorialSystem {
  private tutorials: Map<string, Tutorial> = new Map();
  private completedSteps: Map<string, Set<string>> = new Map(); // userId -> stepIds

  constructor() {
    this.initializeTutorials();
  }

  /**
   * Initialize built-in tutorials
   */
  private initializeTutorials(): void {
    // Basic Editing Tutorial
    this.tutorials.set('basic-editing', {
      id: 'basic-editing',
      title: 'Basic Video Editing',
      description: 'Learn the fundamentals of video editing',
      thumbnail: '',
      difficulty: 'beginner',
      duration: 5,
      tags: ['basics', 'editing'],
      views: 0,
      likes: 0,
      author: 'MangaAMV Team',
      steps: [
        {
          id: 'step1',
          title: 'Import Media',
          description: 'Tap the + button to import manga panels or video clips',
          action: 'highlight_import_button',
        },
        {
          id: 'step2',
          title: 'Arrange Timeline',
          description: 'Drag and drop clips onto the timeline',
          action: 'highlight_timeline',
        },
        {
          id: 'step3',
          title: 'Add Transitions',
          description: 'Select a clip and choose a transition effect',
          action: 'highlight_transitions',
        },
        {
          id: 'step4',
          title: 'Export Video',
          description: 'Tap the export button to save your project',
          action: 'highlight_export',
        },
      ],
    });

    // Advanced Effects Tutorial
    this.tutorials.set('advanced-effects', {
      id: 'advanced-effects',
      title: 'Advanced Effects Mastery',
      description: 'Master particle effects, color grading, and more',
      thumbnail: '',
      difficulty: 'advanced',
      duration: 10,
      tags: ['effects', 'advanced'],
      views: 0,
      likes: 0,
      author: 'MangaAMV Team',
      steps: [
        {
          id: 'step1',
          title: 'Open Effects Panel',
          description: 'Tap the Advanced button and select Effects tab',
          action: 'highlight_effects_panel',
        },
        {
          id: 'step2',
          title: 'Add Particles',
          description: 'Choose a particle preset and customize settings',
          action: 'highlight_particles',
        },
        {
          id: 'step3',
          title: 'Apply Color Grading',
          description: 'Select a LUT or adjust color manually',
          action: 'highlight_color_grading',
        },
      ],
    });

    // Audio Sync Tutorial
    this.tutorials.set('audio-sync', {
      id: 'audio-sync',
      title: 'Audio Reactive Editing',
      description: 'Sync effects to music beats',
      thumbnail: '',
      difficulty: 'intermediate',
      duration: 7,
      tags: ['audio', 'sync'],
      views: 0,
      likes: 0,
      author: 'MangaAMV Team',
      steps: [
        {
          id: 'step1',
          title: 'Import Audio',
          description: 'Add your favorite anime song',
          action: 'highlight_audio_import',
        },
        {
          id: 'step2',
          title: 'Enable Beat Detection',
          description: 'Open Audio tab and enable beat detection',
          action: 'highlight_beat_detection',
        },
        {
          id: 'step3',
          title: 'Link Effects to Beats',
          description: 'Make effects react to music automatically',
          action: 'highlight_audio_reactive',
        },
      ],
    });
  }

  /**
   * Get all tutorials
   */
  getTutorials(difficulty?: 'beginner' | 'intermediate' | 'advanced'): Tutorial[] {
    let tutorials = Array.from(this.tutorials.values());
    
    if (difficulty) {
      tutorials = tutorials.filter(t => t.difficulty === difficulty);
    }

    return tutorials.sort((a, b) => b.views - a.views);
  }

  /**
   * Get tutorial by ID
   */
  getTutorial(tutorialId: string): Tutorial | null {
    return this.tutorials.get(tutorialId) || null;
  }

  /**
   * Start tutorial
   */
  startTutorial(tutorialId: string): Tutorial | null {
    const tutorial = this.tutorials.get(tutorialId);
    if (tutorial) {
      tutorial.views += 1;
      this.tutorials.set(tutorialId, tutorial);
      return tutorial;
    }
    return null;
  }

  /**
   * Complete step
   */
  completeStep(userId: string, tutorialId: string, stepId: string): void {
    if (!this.completedSteps.has(userId)) {
      this.completedSteps.set(userId, new Set());
    }
    
    this.completedSteps.get(userId)!.add(`${tutorialId}:${stepId}`);
  }

  /**
   * Check if step completed
   */
  isStepCompleted(userId: string, tutorialId: string, stepId: string): boolean {
    const userSteps = this.completedSteps.get(userId);
    return userSteps ? userSteps.has(`${tutorialId}:${stepId}`) : false;
  }

  /**
   * Get tutorial progress
   */
  getTutorialProgress(userId: string, tutorialId: string): number {
    const tutorial = this.tutorials.get(tutorialId);
    if (!tutorial) return 0;

    const completedCount = tutorial.steps.filter(step =>
      this.isStepCompleted(userId, tutorialId, step.id)
    ).length;

    return (completedCount / tutorial.steps.length) * 100;
  }

  /**
   * Like tutorial
   */
  likeTutorial(tutorialId: string): void {
    const tutorial = this.tutorials.get(tutorialId);
    if (tutorial) {
      tutorial.likes += 1;
      this.tutorials.set(tutorialId, tutorial);
    }
  }
}

/**
 * Achievement System
 */
export class AchievementSystem {
  private achievements: Map<string, {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    goal: number;
  }> = new Map();

  constructor() {
    this.initializeAchievements();
  }

  /**
   * Initialize achievements
   */
  private initializeAchievements(): void {
    const baseAchievements = [
      {
        id: 'first_edit',
        title: 'First Steps',
        description: 'Create your first video',
        icon: '🎬',
        unlocked: false,
        progress: 0,
        goal: 1,
      },
      {
        id: 'effects_master',
        title: 'Effects Master',
        description: 'Use 10 different effects',
        icon: '✨',
        unlocked: false,
        progress: 0,
        goal: 10,
      },
      {
        id: 'social_star',
        title: 'Social Star',
        description: 'Share 5 videos on social media',
        icon: '⭐',
        unlocked: false,
        progress: 0,
        goal: 5,
      },
      {
        id: 'community_hero',
        title: 'Community Hero',
        description: 'Get 100 likes on your posts',
        icon: '❤️',
        unlocked: false,
        progress: 0,
        goal: 100,
      },
      {
        id: 'tutorial_complete',
        title: 'Student',
        description: 'Complete all beginner tutorials',
        icon: '📚',
        unlocked: false,
        progress: 0,
        goal: 3,
      },
    ];

    baseAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  /**
   * Update achievement progress
   */
  updateProgress(achievementId: string, progress: number): boolean {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) return false;

    achievement.progress = Math.min(progress, achievement.goal);
    
    if (achievement.progress >= achievement.goal && !achievement.unlocked) {
      achievement.unlocked = true;
      this.achievements.set(achievementId, achievement);
      return true; // Achievement unlocked!
    }

    this.achievements.set(achievementId, achievement);
    return false;
  }

  /**
   * Get all achievements
   */
  getAllAchievements() {
    return Array.from(this.achievements.values());
  }

  /**
   * Get unlocked achievements
   */
  getUnlockedAchievements() {
    return this.getAllAchievements().filter(a => a.unlocked);
  }

  /**
   * Get achievement by ID
   */
  getAchievement(achievementId: string) {
    return this.achievements.get(achievementId);
  }
}

/**
 * Notification Manager
 */
export class NotificationManager {
  /**
   * Send notification
   */
  async sendNotification(title: string, body: string, data?: any): Promise<void> {
    console.log('Notification:', title, body, data);
    // Use expo-notifications
  }

  /**
   * Notify new follower
   */
  async notifyNewFollower(followerName: string): Promise<void> {
    await this.sendNotification(
      'New Follower',
      `${followerName} started following you!`,
      { type: 'new_follower' }
    );
  }

  /**
   * Notify post liked
   */
  async notifyPostLiked(postTitle: string, likerName: string): Promise<void> {
    await this.sendNotification(
      'Post Liked',
      `${likerName} liked your post "${postTitle}"`,
      { type: 'post_liked' }
    );
  }

  /**
   * Notify new comment
   */
  async notifyNewComment(postTitle: string, commenterName: string): Promise<void> {
    await this.sendNotification(
      'New Comment',
      `${commenterName} commented on "${postTitle}"`,
      { type: 'new_comment' }
    );
  }

  /**
   * Notify achievement unlocked
   */
  async notifyAchievementUnlocked(achievementTitle: string): Promise<void> {
    await this.sendNotification(
      'Achievement Unlocked! 🎉',
      achievementTitle,
      { type: 'achievement' }
    );
  }
}
