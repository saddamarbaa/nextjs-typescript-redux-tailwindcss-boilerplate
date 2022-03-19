export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  gender: string;
  month: string;
  day: number;
  year: string;
  acceptTerms: boolean;
};

export interface _authPrototypeReducerState {
  loginUser: any;
  loginUserIsLoading: boolean;
  loginUserIsSuccess: boolean;
  loginUserIsError: boolean;
  loginMessage: string;

}
