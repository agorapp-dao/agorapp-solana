import Mocha from 'mocha';
import { TSuiteOutput, TTest } from './types';

const { EVENT_RUN_BEGIN, EVENT_RUN_END, EVENT_TEST_FAIL, EVENT_TEST_PASS } = Mocha.Runner.constants; // other constants https://mochajs.org/api/runner.js.html

export class TestSuiteServiceReporter {
  private _results: TTest[] = [];
  private _hasError = false;

  constructor(runner: Mocha.Runner) {
    const { stats } = runner;

    runner
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .on(EVENT_RUN_BEGIN, () => {})
      .on(EVENT_TEST_PASS, test => {
        this._results.push({
          title: test.title,
          failed: false,
          error: '',
        });
      })
      .on(EVENT_TEST_FAIL, (test, error) => {
        this._hasError = true;
        this._results.push({
          title: test.title,
          failed: true,
          error: error.message,
        });
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .once(EVENT_RUN_END, () => {});
  }

  public getTestsResult(): TSuiteOutput {
    console.log('this._results ', this._results);
    if (this._hasError) {
      return {
        suiteOutput: this._results,
        testsSuitePassed: false,
      };
    } else {
      return {
        suiteOutput: this._results,
        testsSuitePassed: true,
      };
    }
  }

  public hasError(): boolean {
    return this._hasError;
  }
}
