import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if (isLoggedIn()) {
    return true;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    return router.parseUrl('/login');
  }
};

const isLoggedIn = ():boolean => {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = atob(token.split('.')[1]);
    const parsedPayload = JSON.parse(payload);
    return parsedPayload.exp > Math.floor((Date.now()/1000));
  }
  return false;
}