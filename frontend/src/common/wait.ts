
/// Waits for the given number of milliseconds.
export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
