export interface Source {
  /** Who published the numbers. */
  label: string;
  url?: string;
  /** Caveats a reader should know before quoting the figure. */
  note?: string;
}
