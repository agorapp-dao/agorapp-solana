export enum ESubmissionType {
  COURSE = 'course',
  CHALLENGE = 'challenge',
}

export interface TSuiteOutput {
  suiteOutput: TTest[];
  testsSuitePassed: boolean;
  error?: string;
}

export type TTest = {
  title: string;
  failed: boolean;
  error?: string;
};
