import ajax from './ajax'

const BASE = '';

export const repLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');
export const repAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST');