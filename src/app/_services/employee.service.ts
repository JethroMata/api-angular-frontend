import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Employee } from '@app/_models/employee';

const baseUrl = `${environment.apiUrl}/employees`;

// ✅ Define Manager interface BEFORE using it
export interface Manager {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  position: string;
}
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseUrl = '/employees';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(baseUrl);
  }

  getById(EmployeeID: string): Observable<Employee> {
    return this.http.get<Employee>(`${baseUrl}/${EmployeeID}`);
  }

  create(params: any): Observable<Employee> {
    return this.http.post<Employee>(baseUrl, params);
  }

  update(EmployeeID: string, params: any): Observable<Employee> {
    return this.http.put<Employee>(`${baseUrl}/${EmployeeID}`, params);
  }

  delete(EmployeeID: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${EmployeeID}`);
  }

  getNextId(): Observable<{ nextId: string }> {
    return this.http.get<{ nextId: string }>(`${baseUrl}/next-id`);
  }

  transfer(EmployeeID: string, toDeptId: number): Observable<any> {
    return this.http.post(`${baseUrl}/${EmployeeID}/transfer`, { toDeptId });
  }

  // ---------- WORKFLOW ----------
  getWorkflow(employeeId: string | number) {
    return this.http.get<any[]>(`${environment.apiUrl}/employee-workflows/${employeeId}`);
}

getHeadByDepartment(deptId: number) {
  return this.http.get<any>(`${baseUrl}/head/${deptId}`);
}

// ✅ Get all managers for the Head dropdown
 getManagers() {
  return this.http.get<any[]>(`${environment.apiUrl}/employees/managers`);
}
}
