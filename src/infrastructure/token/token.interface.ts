export interface IToken {
  id: number;
  is_active: boolean;
  role: string;
  iat?:string,
  exp?:string
}
