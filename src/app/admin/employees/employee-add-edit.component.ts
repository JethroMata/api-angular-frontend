import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '@app/_services/employee.service';
import { AccountService } from '@app/_services/account.service';
import { DepartmentService } from '@app/_services/department.service';
import { PositionService } from '@app/_services/position.service';
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
  submitting = false;

  accounts: Account[] = [];
  departments: Department[] = [];
  positions: any[] = [];
  managers: any[] = [];

  showHeadDropdown = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private accountService: AccountService,
    private departmentService: DepartmentService,
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    this.EmployeeID = this.route.snapshot.params['id'];
    this.isAddMode = !this.EmployeeID;

    // Initialize Form
    this.form = this.formBuilder.group({
      accountId: ['', Validators.required],
      departmentId: ['', Validators.required],
      position: ['', Validators.required],
      headId: [null],
      hireDate: ['', Validators.required],
      status: ['active', Validators.required]
    });

    // Load dropdown data
    this.accountService.getAll().subscribe((accounts) => (this.accounts = accounts));
    this.departmentService.getAll().subscribe((departments) => (this.departments = departments));
    this.positionService.getAll().subscribe((data) => (this.positions = data));

    // Load existing employee if editing
    if (!this.isAddMode && this.EmployeeID) {
      this.employeeService.getById(this.EmployeeID).subscribe((emp) => {
        this.form.patchValue({
          accountId: emp.accountId,
          departmentId: emp.departmentId,
          position: emp.position,
          headId: emp.headId || null,
          hireDate: emp.hireDate,
          status: emp.status || 'active'
        });

        this.updateHeadVisibility(emp.position);
      });
    }
  }

  onPositionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedPosition = target?.value?.toLowerCase();

    if (selectedPosition && selectedPosition !== 'manager') {
      this.showHeadDropdown = true;
      this.loadManagers();
    } else {
      this.showHeadDropdown = false;
      this.form.patchValue({ headId: null });
    }
  }

  private updateHeadVisibility(position: string): void {
    if (!position) {
      this.showHeadDropdown = false;
      return;
    }

    if (position.toLowerCase() === 'manager') {
      this.showHeadDropdown = false;
      this.form.get('headId')?.setValue('');
    } else {
      this.showHeadDropdown = true;
      this.loadManagers();
    }
  }

  loadManagers() {
    this.employeeService.getManagers().subscribe({
      next: (data) => {
        // ✅ FIX — ensure we have EmployeeID and Account name
        this.managers = data || [];
      },
      error: (err) => {
        console.error('Failed to load managers:', err);
      }
    });
  }

  onDepartmentChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const deptId = select?.value;
    if (!deptId) return;

    this.employeeService.getHeadByDepartment(+deptId).subscribe({
      next: (head: any) => {
        if (head && head.EmployeeID) {
          // ✅ FIX — use EmployeeID (varchar) not Account.id (number)
          this.form.patchValue({ headId: head.EmployeeID });
        } else {
          this.form.patchValue({ headId: null });
        }
      },
      error: (err) => console.error('Failed to load department head', err)
    });
  }

  onSubmit(): void {
    this.submitting = true;
    if (this.form.invalid) {
      this.submitting = false;
      return;
    }

    // ✅ FIX — keep headId as string (EmployeeID), not convert to number
    const payload = {
      ...this.form.value,
      headId:
        this.form.value.headId && this.form.value.headId !== 'undefined'
          ? String(this.form.value.headId)
          : null
    };

    console.log('Submitting payload:', payload); // helpful debug

    const request$ = this.isAddMode
      ? this.employeeService.create(payload)
      : this.employeeService.update(this.EmployeeID, payload);

    request$.subscribe({
      next: () => {
        alert(`Employee ${this.isAddMode ? 'added' : 'updated'} successfully!`);
        this.router.navigate(['/admin/employees']);
      },
      error: (err) => {
        console.error('Error saving employee:', err);
        alert('Failed to save employee.');
        this.submitting = false;
      }
    });
  }
}
