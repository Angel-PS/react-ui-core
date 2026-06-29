/**
 * Pagination + totals metadata returned alongside a paged collection. Drives the
 * `<Table>` footer pagination when present.
 */
export interface Metadata {
  pagination?: {
    current?: number;
    count?: number;
    size?: number;
  };
  totals?: Record<string, number>;
}
