export default class User {
  userId;

  tokenExpireDate;

  name;

  constructor(email) {
    this.email = email;
  }
}
