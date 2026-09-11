import {
  email,
  minLength,
  required,
  SchemaFn,
} from '@angular/forms/signals';

export interface LoginFormModel {
  username: string;
  password: string;
}

export const loginFormInitialState: LoginFormModel = {
  username: '',
  password: '',
};

export const loginFormSchema: SchemaFn<LoginFormModel> = (schema) => {
  required(schema.username);
  email(schema.username);
  required(schema.password);
  minLength(schema.password, 8);
};
