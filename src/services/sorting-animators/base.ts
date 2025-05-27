export abstract class SortAnimatorBase<T extends object> {
  protected currGen: Generator<T>;
  protected size: number;
  protected abstract getGeneratorFunction(): Generator<T>;

  constructor(size: number) {
    this.size = Math.max(1, size);
    this.currGen = this.getGeneratorFunction();
  }

  public next() {
    const next = this.currGen.next();
    if (next.done !== undefined && !next.done) {
      return next.value;
    }
    return undefined;
  }

  public reset() {
    this.currGen = this.getGeneratorFunction();
  }
}
