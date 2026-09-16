export interface ITextValue {
  text: string;
  value: string;
  additionalInfo?: {
    disabled?: boolean;
    [key: string]: unknown;
  };
}
