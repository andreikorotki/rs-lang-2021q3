export default class Attempt {
  constructor(isSuccess) {
    this.success = isSuccess;
    this.date = new Date(Date.now()).toString();
  }
}
