export class AccountRequestOutput {
  constructor(
    public email: string = '',
    public first_name: string = '',
    public last_name: string = '',
    public laboratory: string = '',
    public comment: string = '',
    public password: string = '',
  ) {
  }
}
