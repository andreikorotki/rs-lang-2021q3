/* eslint-disable no-console */
import { createUser, loginUser } from '../api/users';
import User from '../models/user';
import { updateState } from '../services/state';
import { filterObject } from '../services/utils';

export async function loginUserController(userEmail, userPassword) {
  let user = new User(userEmail);
  const responseData = await loginUser({ email: user.email, password: userPassword });
  if (responseData.success) {
    user = { ...user, ...responseData.content };
    user.tokenExpireDate = new Date();
    updateState(user);
  }
  return responseData;
}

export async function createUserController(userName, userEmail, userPassword) {
  const newUser = new User(userEmail);
  newUser.name = userName;
  newUser.password = userPassword;
  const required = ['name', 'password', 'email'];
  const filteredUser = filterObject(newUser, required);
  const responseData = await createUser(filteredUser);
  return responseData;
}
