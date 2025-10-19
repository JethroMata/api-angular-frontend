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
 // styleUrls: ['./employee-add-edit.component.css']
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
  showHeadField = false;
  loadingManagers = false;

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
  this.employeeService.getById(this.EmployeeID).subscribe(emp => {
    this.form.patchValue({
      accountId: emp.accountId,
      departmentId: emp.departmentId,
      position: emp.position, // ✅ fix here
      headId: emp.headId || null,
      hireDate: emp.hireDate,
      status: emp.status || 'active'
    });


        this.updateHeadVisibility(emp.position);
      });
    }
  }

  // ✅ Called when user changes Position dropdown
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

  // ✅ Show Head dropdown only if position != "Manager"
  private updateHeadVisibility(position: string): void {
    if (!position) {
      this.showHeadField = false;
      return;
    }

    if (position.toLowerCase() === 'manager') {
      this.showHeadField = false;
      this.form.get('headId')?.setValue('');
    } else {
      this.showHeadField = true;
      this.loadManagers();
    }
  }

  // ✅ Load all Managers from backend (via /accounts/managers)
  loadManagers() {
  this.employeeService.getManagers().subscribe({
    next: (data) => {
      this.managers = data || [];
      console.log('✅ Managers loaded:', this.managers);

      // 👇 Add this line
      if (this.managers.length > 0) {
       console.log('🧩 Example manager object:', JSON.stringify(this.managers[0], null, 2));
      }
    },
    error: (err) => {
      console.error('❌ Failed to load managers:', err);
    }
  });
}

  // ✅ Department dropdown change handler (kept from your code)
  onDepartmentChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const deptId = select?.value;
    if (!deptId) return;

    this.employeeService.getHeadByDepartment(+deptId).subscribe({
      next: (head: any) => {
        if (head && head.Account) {
          this.form.patchValue({ headId: head.Account.id });
        } else {
          this.form.patchValue({ headId: null });
        }
      },
      error: (err) => console.error('Failed to load department head', err)
    });
  }

  // ✅ Submit form (Create or Update)
  onSubmit(): void {
    this.submitting = true;
    if (this.form.invalid) {
      this.submitting = false;
      return;
    }

    const payload = {
  ...this.form.value,
  headId:
    this.form.value.headId && this.form.value.headId !== 'undefined'
      ? Number(this.form.value.headId)
      : null
};
    console.log('Submitting employee payload:', payload);

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
