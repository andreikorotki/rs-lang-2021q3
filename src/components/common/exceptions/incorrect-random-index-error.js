import { ExtendableError } from './extendable-error';

export class IncorrectRandomIndexError extends ExtendableError {
  constructor(message) {
    super(message);
    this.message = message;
  }
}
