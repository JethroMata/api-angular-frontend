import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
  private accountSubject: BehaviorSubject<Account | null>;
  public account: Observable<Account | null>;

  constructor(private http: HttpClient) {
    this.accountSubject = new BehaviorSubject<Account | null>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue() {
    return this.accountSubject.value;
  }

  // ✅ login
  login(email: string, password: string) {
    return this.http.post<Account>(`${baseUrl}/authenticate`, { email, password })
      .pipe(map(account => {
        this.accountSubject.next(account);
        return account;
      }));
  }

  // ✅ logout
  logout() {
    this.accountSubject.next(null);
  }

  // ✅ refresh token
  refreshToken() {
    return this.http.post<Account>(`${baseUrl}/refresh-token`, {})
      .pipe(map(account => {
        this.accountSubject.next(account);
        return account;
      }));
  }

  // ✅ register
  register(account: Account) {
    return this.http.post(`${baseUrl}/register`, account);
  }

  // ✅ forgot password
  forgotPassword(email: string) {
    return this.http.post(`${baseUrl}/forgot-password`, { email });
  }

  // ✅ reset password
  resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
  }

  // ✅ validate reset token
  validateResetToken(token: string) {
    return this.http.post(`${baseUrl}/validate-reset-token`, { token });
  }

  // ✅ verify email
  verifyEmail(token: string) {
    return this.http.post(`${baseUrl}/verify-email`, { token });
  }

  // ✅ CRUD
  getAll() {
    return this.http.get<Account[]>(baseUrl);
  }

  getById(id: string | number) {
    return this.http.get<Account>(`${baseUrl}/${id}`);
  }

  create(account: Account) {
    return this.http.post(baseUrl, account);
  }

  update(id: string | number, params: any) {
    return this.http.put(`${baseUrl}/${id}`, params)
      .pipe(map(x => {
        if (id == this.accountValue?.id) {
          const updated = { ...this.accountValue, ...params };
          this.accountSubject.next(updated as Account);
        }
        return x;
      }));
  }

  delete(id: string | number) {
    return this.http.delete(`${baseUrl}/${id}`)
      .pipe(map(x => {
        if (id == this.accountValue?.id) {
          this.logout();
        }
        return x;
      }));
  }
}
