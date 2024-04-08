import Mocha from 'mocha';
import { TestSuiteServiceReporter } from './TestSuiteServiceReporter';
import { TSuiteOutput } from './types';

export class TestSuiteService {
  private _suitename: string;
  private _suite: Mocha.Suite;
  private _runner: Mocha.Runner;
  private _mocha: Mocha;
  private _reporter: TestSuiteServiceReporter;

  constructor(suiteName: string, timeout: number) {
    this._suitename = suiteName;
    this._mocha = new Mocha({ bail: false, timeout: timeout });
    this._suite = Mocha.Suite.create(this._mocha.suite, suiteName);
    this._runner = new Mocha.Runner(this._suite);
    this._reporter = new TestSuiteServiceReporter(this._runner);
  }

  addTest(_testTitle: string, _fn: Mocha.AsyncFunc) {
    this._suite.addTest(new Mocha.Test(_testTitle, _fn));
  }

  async runSuite() {
    const testFailures = await new Promise<number>(resolve => {
      this._runner.run(resolve);
    });
    this._suite.dispose();
    this._runner.dispose();
  }

  getResult<T extends TSuiteOutput>(): T {
    return this._reporter.getTestsResult() as T;
  }

  hasError(): boolean {
    return this._reporter.hasError();
  }
}
