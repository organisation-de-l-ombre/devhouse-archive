export class Logger {
  private color: string;

  constructor(private name: string) {
    this.color = Math.floor(Math.random() * 16777215).toString(16);
  }

  private internalLog(level: string[], ...args: string[]): void {
    if (process.env.NODE_ENV === "test") return;
    // eslint-disable-next-line no-console
    console.log(
      `%c[${this.name}]%c[${level[0]}] %c${args.join(" ")}`,
      `color: blue; background: #${this.color};`,
      level[1],
      "color: unset; background: unset;"
    );
  }

  info = (...args: string[]): void =>
    this.internalLog(["info", "color: lightblue"], ...args);

  log = (...args: string[]): void =>
    this.internalLog(["info", "color: lightblue"], ...args);

  error = (...args: string[]): void =>
    this.internalLog(["error", "color: red"], ...args);

  panic = (...args: string[]): void =>
    this.internalLog(["panic", "color: red"], ...args);
}
