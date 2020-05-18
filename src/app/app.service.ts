import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:8000/api';
  username: string;

  constructor(private http: HttpClient) {}

  // Returns all members
  getMembers() {
    return this.http
      .get(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }

  setUsername(name: string): void {
    this.username = name;
  }

  addMember(memberForm) {
      this.http.post(`${this.api}/addMember`, memberForm)
          .subscribe(
              (data) => {},
              (err) => {
                  this.handleError(err);
              });
   }

  updateMember(memberForm, id) {
      return this.http.put(`${this.api}/members/${id}`, memberForm)
      .subscribe(
          (data) => {},
          (err) => {
              this.handleError(err);
          });
  }

    getTeams() {
        return this.http
            .get(`${this.api}/teams`)
            .pipe(catchError(this.handleError));
    }

   deleteMember(id) {
        const endPoints = '/members/' + id;
        this.http.delete(this.api + endPoints) .subscribe(
            (data) => {},
            (err) => {
                this.handleError(err);
            });
    }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
