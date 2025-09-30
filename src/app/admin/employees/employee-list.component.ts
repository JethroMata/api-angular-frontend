import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '@app/_services/employee.service';
import { DepartmentService } from '@app/_services/department.service';
import { Employee } from '@app/_models/employee';
import { Department } from '@app/_models/department';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  loading = true;

  // allow null initially
  selectedEmployee: Employee | null = null;
  newDepartmentId: number | null = null;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAll().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load employees', err);
        this.loading = false;
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data: Department[]) => this.departments = data,
      error: (err: any) => console.error('Failed to load departments', err)
    });
  }

  formatDate(isoString: string): string {
    return isoString ? new Date(isoString).toLocaleDateString('en-US') : '';
  }

  viewRequests(emp: Employee) {
    this.router.navigate(['/admin/requests'], { queryParams: { employeeId: emp.EmployeeID } });
  }

  viewWorkflows(emp: Employee) {
  this.router.navigate(['/admin/employees', emp.EmployeeID, 'workflow']);
}


  editEmployee(emp: Employee) {
    this.router.navigate(['/admin/employees/edit', emp.EmployeeID]);
  }

  addEmployee() {
    this.router.navigate(['/admin/employees/add']);
  }

  openTransferModal(emp: Employee) {
    this.selectedEmployee = emp;
    this.newDepartmentId = emp.departmentId || null;

    const modalEl = document.getElementById('transferModal');
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  }

  closeModal() {
    const modalEl = document.getElementById('transferModal');
    if (modalEl) {
      const modal = Modal.getInstance(modalEl);
      modal?.hide();
    }
  }

  transferEmployee() {
    if (!this.selectedEmployee || this.newDepartmentId === null) return;

    this.employeeService
      .transfer(this.selectedEmployee.EmployeeID, this.newDepartmentId)
      .subscribe({
        next: () => {
          alert('Employee transferred successfully!');
          this.closeModal();
          this.loadEmployees();
        },
        error: err => console.error('Transfer failed', err)
      });
  }
}
