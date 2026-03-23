export interface Option<T = unknown> {
  label: string;
  value: string | number;
  selected?: boolean;
  data?: T;
}
