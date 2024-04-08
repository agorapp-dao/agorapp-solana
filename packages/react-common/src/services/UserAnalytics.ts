import crypto from 'crypto';

export enum EAnalyticsCategories {
  HOMEPAGE = 'HOMEPAGE',
  EDITOR = 'EDITOR',
  SHARED = 'SHARED', // category for events that are shared across the application, i.e.: login/logout
}

export enum EAnalyticsActions {
  GET_STARTED = 'GET_STARTED',
  STARTED_COURSE = 'STARTED_COURSE',
  STARTED_CHALLENGE = 'STARTED_CHALLENGE',
  SUCCESSFUL_LESSON = 'SUCCESSFUL_LESSON',
  UNSUCCESSFUL_LESSON = 'UNSUCCESSFUL_LESSON',
  SUCCESSFUL_CHALLENGE = 'SUCCESSFUL_CHALLENGE',
  UNSUCCESSFUL_CHALLENGE = 'UNSUCCESSFUL_CHALLENGE',
  COMPLETED_COURSE = 'COMPLETED_COURSE',
  COURSE_MORE_INFO = 'COURSE_MORE_INFO',
  RUN_CODE = 'RUN_CODE',
  RESET_CODE = 'RESET_CODE',
  GO_TO_NEXT_LESSON = 'GO_TO_NEXT_LESSON',
  GO_TO_PREVIOUS_LESSON = 'GO_TO_PREVIOUS_LESSON',
  TURN_FULL_SCREEN_ON = 'TURN_FULL_SCREEN_ON',
  TURN_FULL_SCREEN_OFF = 'TURN_FULL_SCREEN_OFF',
  GITHUB_LOGIN = 'GITHUB_LOGIN',
  GMAIL_LOGIN = 'GMAIL_LOGIN',
  LOGOUT = 'LOGOUT',
  OPEN_MODAL = 'OPEN_MODAL',
  CLOSE_MODAL = 'CLOSE_MODAL',
}

type TEvent = {
  category: EAnalyticsCategories;
  action: EAnalyticsActions;
  value?: number;
  label?: string;
};

type TGTag = (...args: any[]) => void;

interface IWindowWithGA extends Window {
  gtag: TGTag;
}

export class UserAnalytics {
  private gaTrackingCode?: string;
  gtag?: TGTag;

  constructor(gaCode?: string) {
    const gaTrackingCode = gaCode || process.env.REACT_APP_GA_TRACKING_CODE;
    if (!gaTrackingCode) {
      return;
    }
    if (typeof gaTrackingCode !== 'string') {
      throw new Error('Missing `gaCode` parameter or `REACT_APP_GA_TRACKING_CODE` in .env file.');
    }
    this.gaTrackingCode = gaTrackingCode;
    if (!this.hasWindowWithGA()) {
      throw new Error(
        'Cannot instantiate Google Analytics UserService a in a server context or client without `gtag` injected in its window object.',
      );
    }
    this.gtag = (window as unknown as IWindowWithGA).gtag;
  }

  private hashUserCredentials(oauthCredentials: string): string {
    const hash = crypto.createHash('sha256');
    const hashedCredentials = hash.update(oauthCredentials).digest('hex');
    return hashedCredentials;
  }

  private hasWindowWithGA(): boolean {
    return typeof window !== 'undefined' && Object.keys(window).indexOf('gtag') !== -1;
  }

  private executeInBrowserContext(fn: Function, ...args: any[]): void {
    if (this.hasWindowWithGA()) {
      fn(...args);
    } else {
      // TODO: improve how to handle it
      console.warn('GA UserAnalytics service is being run in a non-browser context');
    }
  }

  setUserId(oauthCredentials: string): void {
    this.executeInBrowserContext(() => {
      if (!this.gtag) return;
      const userId = this.hashUserCredentials(oauthCredentials);
      this.gtag('config', this.gaTrackingCode, {
        user_id: userId,
      });
    });
  }

  unsetUserId(): void {
    this.executeInBrowserContext(() => {
      if (!this.gtag) return;
      this.gtag('config', this.gaTrackingCode, {
        user_id: null,
      });
    });
  }

  sendGAEvent(eventPayload: TEvent): void {
    this.executeInBrowserContext(() => {
      if (!this.gtag) return;

      const cleanedEventPayload = Object.fromEntries(
        Object.entries(eventPayload).filter(([_, v]) => v != null),
      ) as TEvent;

      this.gtag('event', cleanedEventPayload.action, {
        event_category: cleanedEventPayload.category,
        event_label: cleanedEventPayload.label,
        value: cleanedEventPayload.value,
      });
    });
  }

  pageView(currentPage: string): void {
    this.executeInBrowserContext(() => {
      if (!this.gtag) return;
      this.gtag('config', this.gaTrackingCode, {
        page_path: currentPage,
      });
    });
  }
}
