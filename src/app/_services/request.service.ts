import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RequestItem {
  name: string;
  quantity: number;
}

export interface RequestModel {
  accountId: number;
  type: string;
  items: RequestItem[];
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = 'http://localhost:4000/requests';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(request: RequestModel): Observable<any> {
    return this.http.post<any>(this.baseUrl, request);
  }

  update(id: number, request: RequestModel): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
