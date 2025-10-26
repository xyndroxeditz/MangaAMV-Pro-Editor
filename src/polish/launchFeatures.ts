/**
 * App Polish & Launch Features
 * Onboarding, app icons, splash screens, analytics
 */

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image: string;
  action?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  autoSave: boolean;
  cloudSync: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  hapticFeedback: boolean;
  analyticsEnabled: boolean;
}

/**
 * Onboarding Manager
 */
export class OnboardingManager {
  private steps: OnboardingStep[] = [];
  private currentStep: number = 0;
  private completed: boolean = false;

  constructor() {
    this.initializeSteps();
  }

  /**
   * Initialize onboarding steps
   */
  private initializeSteps(): void {
    this.steps = [
      {
        id: 'welcome',
        title: 'Welcome to MangaAMV Pro',
        description: 'Create stunning manga music videos with AI-powered tools',
        image: 'onboarding_welcome.png',
      },
      {
        id: 'import',
        title: 'Import Your Manga',
        description: 'Import manga panels, anime clips, or images from your device',
        image: 'onboarding_import.png',
        action: 'show_import_demo',
      },
      {
        id: 'effects',
        title: 'Add Amazing Effects',
        description: 'Choose from 100+ effects, particles, and transitions',
        image: 'onboarding_effects.png',
        action: 'show_effects_demo',
      },
      {
        id: 'audio',
        title: 'Sync to Music',
        description: 'Make your edits react to music beats automatically',
        image: 'onboarding_audio.png',
        action: 'show_audio_demo',
      },
      {
        id: 'ai',
        title: 'AI-Powered Tools',
        description: 'Let AI detect scenes, track objects, and suggest edits',
        image: 'onboarding_ai.png',
        action: 'show_ai_demo',
      },
      {
        id: 'export',
        title: 'Share Your Masterpiece',
        description: 'Export in 4K and share directly to Instagram, TikTok, YouTube',
        image: 'onboarding_export.png',
        action: 'show_export_demo',
      },
      {
        id: 'community',
        title: 'Join the Community',
        description: 'Connect with creators, share your work, and get inspired',
        image: 'onboarding_community.png',
      },
    ];
  }

  /**
   * Get current step
   */
  getCurrentStep(): OnboardingStep | null {
    return this.steps[this.currentStep] || null;
  }

  /**
   * Get all steps
   */
  getAllSteps(): OnboardingStep[] {
    return this.steps;
  }

  /**
   * Next step
   */
  nextStep(): boolean {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      return true;
    }
    
    this.completed = true;
    return false;
  }

  /**
   * Previous step
   */
  previousStep(): boolean {
    if (this.currentStep > 0) {
      this.currentStep--;
      return true;
    }
    return false;
  }

  /**
   * Skip onboarding
   */
  skip(): void {
    this.completed = true;
    this.currentStep = this.steps.length;
  }

  /**
   * Is completed
   */
  isCompleted(): boolean {
    return this.completed;
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    return ((this.currentStep + 1) / this.steps.length) * 100;
  }

  /**
   * Reset onboarding
   */
  reset(): void {
    this.currentStep = 0;
    this.completed = false;
  }
}

/**
 * Settings Manager
 */
export class SettingsManager {
  private settings: AppSettings;

  constructor() {
    this.settings = this.getDefaultSettings();
    this.loadSettings();
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): AppSettings {
    return {
      theme: 'dark',
      language: 'en',
      notifications: true,
      autoSave: true,
      cloudSync: true,
      quality: 'high',
      hapticFeedback: true,
      analyticsEnabled: true,
    };
  }

  /**
   * Load settings from storage
   */
  private async loadSettings(): Promise<void> {
    try {
      // Use AsyncStorage
      // const saved = await AsyncStorage.getItem('app_settings');
      // if (saved) {
      //   this.settings = { ...this.settings, ...JSON.parse(saved) };
      // }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  /**
   * Save settings to storage
   */
  private async saveSettings(): Promise<void> {
    try {
      // await AsyncStorage.setItem('app_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Get all settings
   */
  getSettings(): AppSettings {
    return { ...this.settings };
  }

  /**
   * Update setting
   */
  async updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    this.settings[key] = value;
    await this.saveSettings();
  }

  /**
   * Get setting
   */
  getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.settings[key];
  }

  /**
   * Reset to defaults
   */
  async resetToDefaults(): Promise<void> {
    this.settings = this.getDefaultSettings();
    await this.saveSettings();
  }

  /**
   * Export settings
   */
  exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  /**
   * Import settings
   */
  async importSettings(json: string): Promise<boolean> {
    try {
      const imported = JSON.parse(json);
      this.settings = { ...this.settings, ...imported };
      await this.saveSettings();
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
}

/**
 * Analytics Manager (Privacy-focused, no paid services)
 */
export class AnalyticsManager {
  private events: Array<{
    name: string;
    properties: Record<string, any>;
    timestamp: Date;
  }> = [];

  /**
   * Track event
   */
  trackEvent(name: string, properties?: Record<string, any>): void {
    this.events.push({
      name,
      properties: properties || {},
      timestamp: new Date(),
    });

    // Local analytics only - no external services
    console.log('Event tracked:', name, properties);
  }

  /**
   * Track screen view
   */
  trackScreenView(screenName: string): void {
    this.trackEvent('screen_view', { screen_name: screenName });
  }

  /**
   * Track video export
   */
  trackVideoExport(duration: number, format: string, quality: string): void {
    this.trackEvent('video_export', { duration, format, quality });
  }

  /**
   * Track effect usage
   */
  trackEffectUsage(effectName: string, category: string): void {
    this.trackEvent('effect_used', { effect_name: effectName, category });
  }

  /**
   * Track social share
   */
  trackSocialShare(platform: string): void {
    this.trackEvent('social_share', { platform });
  }

  /**
   * Track tutorial completion
   */
  trackTutorialCompletion(tutorialId: string): void {
    this.trackEvent('tutorial_completed', { tutorial_id: tutorialId });
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    totalEvents: number;
    topEvents: Array<{ name: string; count: number }>;
    recentEvents: Array<{ name: string; timestamp: Date }>;
  } {
    const eventCounts: Record<string, number> = {};
    
    this.events.forEach(event => {
      eventCounts[event.name] = (eventCounts[event.name] || 0) + 1;
    });

    const topEvents = Object.entries(eventCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentEvents = this.events
      .slice(-20)
      .map(event => ({ name: event.name, timestamp: event.timestamp }));

    return {
      totalEvents: this.events.length,
      topEvents,
      recentEvents,
    };
  }

  /**
   * Clear analytics data
   */
  clearData(): void {
    this.events = [];
  }
}

/**
 * App Rating Manager
 */
export class AppRatingManager {
  private requestCount: number = 0;
  private hasRated: boolean = false;
  private lastRequestDate: Date | null = null;

  /**
   * Should request rating
   */
  shouldRequestRating(): boolean {
    if (this.hasRated) return false;

    // Request after 3 video exports
    if (this.requestCount < 3) return false;

    // Don't request more than once per week
    if (this.lastRequestDate) {
      const daysSinceLastRequest = (Date.now() - this.lastRequestDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastRequest < 7) return false;
    }

    return true;
  }

  /**
   * Request rating
   */
  async requestRating(): Promise<void> {
    if (!this.shouldRequestRating()) return;

    try {
      // Use expo-store-review or react-native-rate
      // await StoreReview.requestReview();
      console.log('Requesting app rating...');
      
      this.lastRequestDate = new Date();
    } catch (error) {
      console.error('Error requesting rating:', error);
    }
  }

  /**
   * Increment usage count
   */
  incrementUsageCount(): void {
    this.requestCount++;
  }

  /**
   * Mark as rated
   */
  markAsRated(): void {
    this.hasRated = true;
  }
}

/**
 * Update Manager
 */
export class UpdateManager {
  private currentVersion: string = '1.0.0';
  private latestVersion: string = '1.0.0';
  private updateAvailable: boolean = false;

  /**
   * Check for updates
   */
  async checkForUpdates(): Promise<boolean> {
    try {
      // In production, check against your server or GitHub releases
      // For now, using expo-updates
      console.log('Checking for updates...');
      
      // Simulate update check
      // const response = await fetch('https://your-api.com/version');
      // const data = await response.json();
      // this.latestVersion = data.version;
      
      this.updateAvailable = this.compareVersions(this.latestVersion, this.currentVersion) > 0;
      return this.updateAvailable;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  }

  /**
   * Compare version strings
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (parts1[i] > parts2[i]) return 1;
      if (parts1[i] < parts2[i]) return -1;
    }

    return 0;
  }

  /**
   * Get current version
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  /**
   * Get latest version
   */
  getLatestVersion(): string {
    return this.latestVersion;
  }

  /**
   * Is update available
   */
  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  /**
   * Apply update
   */
  async applyUpdate(): Promise<boolean> {
    try {
      console.log('Applying update...');
      // Use expo-updates
      // await Updates.fetchUpdateAsync();
      // await Updates.reloadAsync();
      return true;
    } catch (error) {
      console.error('Error applying update:', error);
      return false;
    }
  }
}

/**
 * Crash Reporter (Local only, no paid services)
 */
export class CrashReporter {
  private crashes: Array<{
    error: Error;
    timestamp: Date;
    context: Record<string, any>;
  }> = [];

  /**
   * Report crash
   */
  reportCrash(error: Error, context?: Record<string, any>): void {
    this.crashes.push({
      error,
      timestamp: new Date(),
      context: context || {},
    });

    console.error('Crash reported:', error, context);

    // Store locally
    this.saveCrashReports();
  }

  /**
   * Save crash reports
   */
  private async saveCrashReports(): Promise<void> {
    try {
      // Save to AsyncStorage for later review
      const reports = this.crashes.map(crash => ({
        message: crash.error.message,
        stack: crash.error.stack,
        timestamp: crash.timestamp.toISOString(),
        context: crash.context,
      }));

      // await AsyncStorage.setItem('crash_reports', JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving crash reports:', error);
    }
  }

  /**
   * Get crash reports
   */
  getCrashReports() {
    return this.crashes;
  }

  /**
   * Clear crash reports
   */
  clearCrashReports(): void {
    this.crashes = [];
  }
}

/**
 * Performance Monitor
 */
export class AppPerformanceMonitor {
  private metrics: {
    appStartTime: number;
    screenLoadTimes: Map<string, number>;
    actionDurations: Map<string, number[]>;
  };

  constructor() {
    this.metrics = {
      appStartTime: Date.now(),
      screenLoadTimes: new Map(),
      actionDurations: new Map(),
    };
  }

  /**
   * Record screen load time
   */
  recordScreenLoad(screenName: string, duration: number): void {
    this.metrics.screenLoadTimes.set(screenName, duration);
  }

  /**
   * Record action duration
   */
  recordActionDuration(actionName: string, duration: number): void {
    if (!this.metrics.actionDurations.has(actionName)) {
      this.metrics.actionDurations.set(actionName, []);
    }
    this.metrics.actionDurations.get(actionName)!.push(duration);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const actionAverages: Record<string, number> = {};
    
    this.metrics.actionDurations.forEach((durations, action) => {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      actionAverages[action] = avg;
    });

    return {
      appUptime: Date.now() - this.metrics.appStartTime,
      screenLoadTimes: Object.fromEntries(this.metrics.screenLoadTimes),
      actionAverages,
    };
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics.screenLoadTimes.clear();
    this.metrics.actionDurations.clear();
  }
}

/**
 * App Health Check
 */
export class AppHealthCheck {
  /**
   * Run health check
   */
  async runHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check storage
    // const storage = await this.checkStorage();
    // if (storage < 100) {
    //   issues.push('Low storage space');
    //   recommendations.push('Clear cache or remove old projects');
    // }

    // Check memory
    // const memory = await this.checkMemory();
    // if (memory > 80) {
    //   issues.push('High memory usage');
    //   recommendations.push('Close background apps');
    // }

    // Check network
    // const network = await this.checkNetwork();
    // if (!network) {
    //   issues.push('No internet connection');
    //   recommendations.push('Cloud features disabled');
    // }

    const status = issues.length === 0 ? 'healthy' : issues.length < 3 ? 'warning' : 'critical';

    return { status, issues, recommendations };
  }

  /**
   * Check storage
   */
  private async checkStorage(): Promise<number> {
    // Return available storage in MB
    return 1000;
  }

  /**
   * Check memory
   */
  private async checkMemory(): Promise<number> {
    // Return memory usage percentage
    return 50;
  }

  /**
   * Check network
   */
  private async checkNetwork(): Promise<boolean> {
    // Check internet connectivity
    return true;
  }
}
