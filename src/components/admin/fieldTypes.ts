export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "image"
  | "video"
  | "select";

export interface AdminField {
  name: string;
  label: string;
  type: AdminFieldType;
  options?: string[];
  folder?: string;
  required?: boolean;
  placeholder?: string;
  /** max duration in seconds for video uploads */
  maxDuration?: number;
}
