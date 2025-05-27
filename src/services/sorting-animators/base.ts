export abstract class SortAnimatorBase<T extends object> {
  protected currGen: Generator<T>;
  protected size: number;
  protected frames: T[] = [];

  protected abstract getGeneratorFunction(): Generator<T>;

  constructor(size: number) {
    this.size = Math.max(1, size);
    this.currGen = this.getGeneratorFunction();
    this.nextFrame();
  }

  public nextFrame() {
    const next = this.currGen.next();
    if (next.done) {
      this.frames.push(next.value);
    }
    return this.frames.length;
  }

  public reset() {
    this.currGen = this.getGeneratorFunction();
    this.frames = [];
    const next = this.currGen.next();
    if (!next.done) {
      this.frames.push(next.value);
    }
  }

  public getFrame(index: number): T | null {
    return this.frames.at(index) ?? null;
  }
}
