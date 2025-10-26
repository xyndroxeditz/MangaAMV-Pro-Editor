/**
 * MangaAMV Pro - Usage Examples
 * Demonstrates how to use all major features
 */

import { masterApp } from '../core/masterManager';

/**
 * Example 1: App Startup
 */
async function startupExample() {
  console.log('=== App Startup Example ===');
  
  await masterApp.startup();
  
  // Check if onboarding needed
  const managers = masterApp.getManagers();
  if (!managers.onboarding.isCompleted()) {
    console.log('Showing onboarding...');
    const step = managers.onboarding.getCurrentStep();
    console.log('Current step:', step?.title);
  }
}

/**
 * Example 2: Export and Share Video
 */
async function exportAndShareExample() {
  console.log('=== Export & Share Example ===');
  
  // Export for Instagram
  const videoPath = await masterApp.exportVideo(
    'project_123',
    'instagram',
    undefined
  );
  
  console.log('Video exported to:', videoPath);
  
  // Share to Instagram
  const shared = await masterApp.shareToSocial(
    videoPath,
    'instagram',
    'Check out my latest AMV! 🔥',
    ['anime', 'amv', 'manga', 'edit']
  );
  
  console.log('Shared successfully:', shared);
}

/**
 * Example 3: Tutorial System
 */
function tutorialExample() {
  console.log('=== Tutorial System Example ===');
  
  const managers = masterApp.getManagers();
  
  // Get all tutorials
  const tutorials = managers.tutorials.getTutorials();
  console.log('Available tutorials:', tutorials.length);
  
  // Start a tutorial
  const tutorial = managers.tutorials.startTutorial('basic-editing');
  console.log('Started tutorial:', tutorial?.title);
  
  // Complete a step
  masterApp.completeTutorialStep('basic-editing', 'step1', 'user_123');
  
  // Check progress
  const progress = managers.tutorials.getTutorialProgress('user_123', 'basic-editing');
  console.log('Tutorial progress:', progress + '%');
}

/**
 * Example 4: Achievements
 */
function achievementsExample() {
  console.log('=== Achievements Example ===');
  
  const managers = masterApp.getManagers();
  
  // Get all achievements
  const achievements = managers.achievements.getAllAchievements();
  console.log('Total achievements:', achievements.length);
  
  // Update progress
  const unlocked = managers.achievements.updateProgress('first_edit', 1);
  if (unlocked) {
    console.log('🎉 Achievement unlocked!');
  }
  
  // Get unlocked achievements
  const unlocked_achievements = managers.achievements.getUnlockedAchievements();
  console.log('Unlocked:', unlocked_achievements.length);
}

/**
 * Example 5: Settings Management
 */
async function settingsExample() {
  console.log('=== Settings Example ===');
  
  const managers = masterApp.getManagers();
  
  // Get current settings
  const settings = managers.settings.getSettings();
  console.log('Current settings:', settings);
  
  // Update a setting
  await managers.settings.updateSetting('quality', 'ultra');
  console.log('Quality set to ultra');
  
  // Get specific setting
  const theme = managers.settings.getSetting('theme');
  console.log('Theme:', theme);
}

/**
 * Example 6: Community Features
 */
async function communityExample() {
  console.log('=== Community Example ===');
  
  const managers = masterApp.getManagers();
  
  // Create a post
  const postId = await managers.community.createPost({
    userId: 'user_123',
    username: 'AnimeEditor',
    avatar: 'https://example.com/avatar.jpg',
    projectId: 'project_123',
    videoUrl: 'https://example.com/video.mp4',
    thumbnail: 'https://example.com/thumb.jpg',
    title: 'Epic AMV!',
    description: 'Check out my latest creation!',
    tags: ['anime', 'amv', 'naruto'],
    likes: 0,
    views: 0,
    comments: 0,
    shares: 0,
  });
  
  console.log('Post created:', postId);
  
  // Get feed
  const feed = await managers.community.getFeed('user_123', 1, 10);
  console.log('Feed posts:', feed.length);
  
  // Get trending
  const trending = await managers.community.getTrendingPosts(5);
  console.log('Trending posts:', trending.length);
}

/**
 * Example 7: Performance Monitoring
 */
function performanceExample() {
  console.log('=== Performance Monitoring Example ===');
  
  const managers = masterApp.getManagers();
  
  // Get current metrics
  const metrics = managers.performance.getMetrics();
  console.log('Performance metrics:', metrics);
  
  // Record frame (performance monitor tracks automatically)
  // managers.performance.recordFrame(16.7); // 60fps
  
  // Update and get metrics again
  const updatedMetrics = managers.performance.getMetrics();
  console.log('Updated metrics:', updatedMetrics);
}

/**
 * Example 8: App Health Check
 */
async function healthCheckExample() {
  console.log('=== Health Check Example ===');
  
  const status = await masterApp.getAppStatus();
  console.log('App Status:', status);
  console.log('- Performance:', status.performance);
  console.log('- Health:', status.health);
  console.log('- Settings:', status.settings);
  console.log('- Achievements:', status.achievements.length);
}

/**
 * Example 9: Battery Optimization
 */
function batteryOptimizationExample() {
  console.log('=== Battery Optimization Example ===');
  
  // Simulate low battery
  masterApp.optimizeForBattery(0.15); // 15% battery
  
  console.log('Battery saver mode activated');
}

/**
 * Example 10: Gesture Handling
 */
function gestureExample() {
  console.log('=== Gesture Handling Example ===');
  
  // Simulate gestures
  const gestures = [
    { type: 'tap', x: 100, y: 200 },
    { type: 'double-tap', x: 150, y: 250 },
    { type: 'long-press', x: 200, y: 300 },
    { type: 'swipe', x: 250, y: 350, velocityX: 500, velocityY: 0 },
    { type: 'pinch', x: 300, y: 400, scale: 1.5 },
  ];
  
  gestures.forEach(gesture => {
    masterApp.handleGesture(gesture);
    console.log('Handled gesture:', gesture.type);
  });
}

/**
 * Example 11: Analytics Tracking
 */
function analyticsExample() {
  console.log('=== Analytics Example ===');
  
  const managers = masterApp.getManagers();
  
  // Track various events
  managers.analytics.trackScreenView('Editor');
  managers.analytics.trackEffectUsage('Motion Blur', 'advanced');
  managers.analytics.trackSocialShare('instagram');
  
  // Get analytics summary
  const summary = managers.analytics.getAnalyticsSummary();
  console.log('Analytics Summary:', summary);
  console.log('- Total Events:', summary.totalEvents);
  console.log('- Top Events:', summary.topEvents);
}

/**
 * Example 12: Complete Workflow
 */
async function completeWorkflowExample() {
  console.log('=== Complete Workflow Example ===');
  
  // 1. Start app
  await masterApp.startup();
  
  // 2. Show tutorial for new users
  const managers = masterApp.getManagers();
  if (!managers.onboarding.isCompleted()) {
    console.log('New user - showing onboarding');
  }
  
  // 3. User creates a project (simulated)
  console.log('User creates project...');
  
  // 4. Export video for TikTok
  console.log('Exporting for TikTok...');
  const videoPath = await masterApp.exportVideo('project_456', 'tiktok');
  
  // 5. Share to TikTok
  console.log('Sharing to TikTok...');
  await masterApp.shareToSocial(
    videoPath,
    'tiktok',
    'My first AMV! 🎬✨',
    ['amv', 'anime', 'tiktok']
  );
  
  // 6. Create community post
  console.log('Creating community post...');
  await managers.community.createPost({
    userId: 'user_456',
    username: 'NewCreator',
    avatar: '',
    projectId: 'project_456',
    videoUrl: videoPath,
    thumbnail: '',
    title: 'My First AMV!',
    description: 'Just made this with MangaAMV Pro!',
    tags: ['beginner', 'amv', 'anime'],
    likes: 0,
    views: 0,
    comments: 0,
    shares: 0,
  });
  
  // 7. Check achievements
  const achievements = managers.achievements.getUnlockedAchievements();
  console.log('Achievements unlocked:', achievements.length);
  
  // 8. Request rating if eligible (would check via settings or separate rating manager)
  console.log('App rating check...');
  
  console.log('✅ Workflow complete!');
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('\n🎬 MangaAMV Pro - Usage Examples\n');
  console.log('=' .repeat(50));
  
  try {
    await startupExample();
    console.log('');
    
    await exportAndShareExample();
    console.log('');
    
    tutorialExample();
    console.log('');
    
    achievementsExample();
    console.log('');
    
    await settingsExample();
    console.log('');
    
    await communityExample();
    console.log('');
    
    performanceExample();
    console.log('');
    
    await healthCheckExample();
    console.log('');
    
    batteryOptimizationExample();
    console.log('');
    
    gestureExample();
    console.log('');
    
    analyticsExample();
    console.log('');
    
    await completeWorkflowExample();
    console.log('');
    
    console.log('=' .repeat(50));
    console.log('✅ All examples completed!');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  } finally {
    // Cleanup
    await masterApp.shutdown();
  }
}

// Export individual examples
export {
  startupExample,
  exportAndShareExample,
  tutorialExample,
  achievementsExample,
  settingsExample,
  communityExample,
  performanceExample,
  healthCheckExample,
  batteryOptimizationExample,
  gestureExample,
  analyticsExample,
  completeWorkflowExample,
};

// Uncomment to run all examples
// runAllExamples();
