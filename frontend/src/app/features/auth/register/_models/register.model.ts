import {
  email,
  minLength,
  required,
  SchemaFn,
} from '@angular/forms/signals';

export interface RegisterFormModel {
  email: string;
  password: string;
}

export const registerFormInitialState: RegisterFormModel = {
  email: '',
  password: '',
};

export const registerFormSchema: SchemaFn<RegisterFormModel> = (schema) => {
  required(schema.email);
  email(schema.email);
  required(schema.password);
  minLength(schema.password, 8);
};
