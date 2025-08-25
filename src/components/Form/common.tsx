export type FieldType = "text" | "textarea" | "select" | "checkbox" | "switch" | "date" | "daterange" | "radio";

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface FieldConfig {
  type: FieldType;
  field: string;
  label: string;
  validation?: boolean;
  options?: SelectOption[];
  onChange?: (value: string | string[] | number | null) => void;
  multipleOption?: Boolean;
  dependsOn?: string;
  width?: string;
}

export type FormComponent =
  | { type: "alert"; alert: { type: "info" | "success" | "warning" | "error"; message: string } }
  | { type: "notice"; notice: { type: string; message: string } }
  | { type: "divider" }
  | { type: "fields"; inline?: boolean; fields: FieldConfig[] }
  | { type: "text"; render: () => React.ReactNode };

export interface FormSection {
  layout: "stacked" | "inline";
  components: FormComponent[];
}