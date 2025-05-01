export interface IUser {
    id?: number;
    username: string;
    password: string;
    role: string;
  }
  
  export interface IUserWithoutPassword extends Omit<IUser, "password"> {
    id: number;
  }
  
  export interface IAuthResponse {
    success: boolean;
    message?: string;
    user?: IUserWithoutPassword;
    token?: string;
  }