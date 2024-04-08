export type TTestResponse = {
  passed: boolean;
  error?: string;
  gas?: number;
  tests: TTest[];
};

export type TTest = {
  title: string;
  passed: boolean;
  error?: string;
};
