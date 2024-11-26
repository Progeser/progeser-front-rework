export class AccountRequestOutput {
  constructor(
    public email: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public laboratory: string = '',
    public comment: string = '',
    public password: string = '',
  ) {
  }
}
