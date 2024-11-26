export class AccountRequest {
  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
    public laboratory: string,
    public accepted: boolean,
    public comment: string
  ) {
  }
}
