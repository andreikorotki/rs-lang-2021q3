export default class Optional {
  constructor(isLearned = false, lastAttempt = null) {
    this.isLearned = isLearned;
    this.startDate = new Date(Date.now()).toString();
    this.successAttempts = 0;
    this.failedAttempts = 0;
    if (lastAttempt) {
      this.lastAttemptSuccess = lastAttempt.success;
      this.lastAttemptDate = lastAttempt.date;
    }
  }
}
