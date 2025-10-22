export abstract class Service<D = null, C extends Record<string, unknown> | null = null> {
  protected dependencies: D
  protected config: C

  constructor(dependencies: D, config: C) {
    this.dependencies = dependencies
    this.config = config
  }
}
