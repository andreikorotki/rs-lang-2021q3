import { createUser, loginUser, setUserStatistics } from '../api/users';
import User from '../models/user';
import UserStatistic from '../models/user-statistic';
import { updateState, filterObject, redirect } from '../services';
import { tokenExpirationPeriodMs } from '../services/settings';
import { renderHeader } from '../utils';

export async function loginUserController(userEmail, userPassword) {
  let user = new User(userEmail);
  const responseData = await loginUser({ email: user.email, password: userPassword });
  if (responseData.success) {
    user = { ...user, ...responseData.content, tokenExpireDate: new Date(Date.now() + tokenExpirationPeriodMs) };
    updateState(user);
    redirect('#');
    renderHeader();
  }
  return responseData;
}

export async function createUserController(userName, userEmail, userPassword) {
  const newUser = new User(userEmail);
  newUser.name = userName;
  newUser.password = userPassword;
  const required = ['name', 'password', 'email'];
  const filteredUser = filterObject(newUser, required);
  const response = await createUser(filteredUser);
  if (response.success) {
    const loginData = await loginUserController(userEmail, userPassword);
    if (loginData.success) {
      const userStat = new UserStatistic();
      await setUserStatistics(loginData.content.userId, userStat);
    }
  }
  return response;
}
