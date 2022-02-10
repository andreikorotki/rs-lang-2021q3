import { ExtendableError } from './extendable-error';

export class NotEnoughWordsError extends ExtendableError {
  constructor(message) {
    super(message);
    this.message = message;
  }
}
