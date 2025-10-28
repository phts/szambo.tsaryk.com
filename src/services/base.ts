export abstract class Service<
  D extends Record<keyof D, unknown> | null = null,
  C extends Record<string, unknown> | null = null,
> {
  protected dependencies: D
  protected config: C

  constructor(dependencies: D, config: C) {
    this.dependencies = dependencies
    this.config = config
  }

  public addDependency(key: keyof D, value: unknown) {
    if (!this.dependencies) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      this.dependencies = {} as D
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dependencies![key] = value
  }
}
