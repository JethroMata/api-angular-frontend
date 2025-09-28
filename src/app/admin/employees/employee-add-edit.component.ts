import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '@app/_services/employee.service';
import { AccountService } from '@app/_services/account.service';
import { DepartmentService } from '@app/_services/department.service';
import { Employee } from '@app/_models/employee';
import { Account } from '@app/_models';
import { Department } from '@app/_models';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './employee-add-edit.component.html'
})
export class EmployeeAddEditComponent implements OnInit {
  form!: FormGroup;
  EmployeeID!: string;
  isAddMode = true;
  loading = false;
  submitted = false;

  accounts: Account[] = [];
  departments: Department[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private accountService: AccountService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.EmployeeID = this.route.snapshot.params['id'];
    this.isAddMode = !this.EmployeeID;

    this.form = this.formBuilder.group({
      accountId: ['', Validators.required],
      departmentId: ['', Validators.required],
      position: ['', Validators.required],
      hireDate: ['', Validators.required],
      status: ['active', Validators.required] 
    });

    this.accountService.getAll().subscribe(accounts => this.accounts = accounts);
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;

      if (!this.isAddMode && this.EmployeeID) {
        this.employeeService.getById(this.EmployeeID).subscribe(emp => {
          this.form.patchValue({
            accountId: emp.accountId,
            departmentId: emp.departmentId,
            position: emp.position,
            hireDate: emp.hireDate,
            status: emp.status || 'active'
          });
        });
      }
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return alert('Please fill all required fields!');
    this.loading = true;

    if (this.isAddMode) this.createEmployee();
    else this.updateEmployee();
  }

  private createEmployee(): void {
    this.employeeService.create(this.form.value).subscribe({
      next: () => {
        alert('Employee created successfully!');
        this.router.navigate(['/admin/employees']);
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  private updateEmployee(): void {
    this.employeeService.update(this.EmployeeID, this.form.value).subscribe({
      next: () => {
        alert('Employee updated successfully!');
        this.router.navigate(['/admin/employees']);
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
