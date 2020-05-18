import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(private router: Router) {
    }

    canActivate() {
         if (localStorage.getItem('username') === null) {
             console.log('OnlyLoggedInUsers allowed');
            return false;
        } else {
            return true;
        }
    }
}
