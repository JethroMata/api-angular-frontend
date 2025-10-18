import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';


@Injectable({ providedIn: 'root' })
export class PositionService {
  private baseUrl = `${environment.apiUrl}/positions`;

  constructor(private http: HttpClient) {}

  // ✅ Get all positions
  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  // ✅ Get a single position by ID
  getById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // ✅ Create a new position
  create(params: any) {
    return this.http.post(this.baseUrl, params);
  }

  // ✅ Update an existing position
  update(id: number, params: any) {
    return this.http.put(`${this.baseUrl}/${id}`, params);
  }

  // ✅ Delete a position
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
