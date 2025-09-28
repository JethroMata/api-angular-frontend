import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '@app/_services/department.service';
import { Department } from '@app/_models';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  loading = true;

  constructor(
    private router: Router,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next: (data: Department[]) => {
        this.departments = data;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load departments', err);
        this.loading = false;
      }
    });
  }

  addDepartment(): void {
    this.router.navigate(['/admin/departments/add']);
  }

  editDepartment(dept: Department): void {
    this.router.navigate(['/admin/departments/edit', dept.id]);
  }

  deleteDepartment(dept: Department): void {
    if (!confirm(`Are you sure you want to delete ${dept.departmentName}?`)) return;
    this.departmentService.delete(dept.id).subscribe({
      next: () => this.departments = this.departments.filter(d => d.id !== dept.id),
      error: err => console.error(err)
    });
  }
}
