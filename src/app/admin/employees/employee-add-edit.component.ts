import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { EmployeeService } from '@app/_services/employee.service';
import { AccountService } from '@app/_services/account.service';
import { DepartmentService } from '@app/_services/department.service';
import { PositionService } from '@app/_services/position.service';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './employee-add-edit.component.html'
})
export class EmployeeAddEditComponent implements OnInit {
  form!: FormGroup;
  EmployeeID!: string | undefined;
  isAddMode = true;
  loading = false;
  submitting = false;

  accounts: any[] = [];
  departments: any[] = [];
  positions: any[] = [];
  managers: any[] = [];

  showHeadDropdown = true;

  constructor(
    private fb: FormBuilder,
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

    // build form
    this.form = this.fb.group({
      accountId: ['', Validators.required],
      departmentId: ['', Validators.required],
      position: ['', Validators.required],
      headId: [null],
      hireDate: ['', Validators.required],
      status: ['active', Validators.required]
    });

    // Load required lists first; only then load employee (if editing)
    Promise.all([this.loadAccounts(), this.loadDepartments(), this.loadPositions()])
      .then(() => {
        console.log('[init] refs loaded', {
          accounts: this.accounts.length,
          departments: this.departments.length,
          positions: this.positions.length
        });

        // after lists loaded, if edit mode -> load employee and patch
        if (!this.isAddMode && this.EmployeeID) {
          this.loadEmployeeAndPatch();
        }

        // subscribe to position changes to handle head visibility
        this.form.get('position')?.valueChanges.subscribe(pos => this.updateHeadVisibility(pos));
      })
      .catch(err => {
        console.error('[init] error loading reference data', err);
        // still attempt employee load so user can edit if refs failed
        if (!this.isAddMode && this.EmployeeID) this.loadEmployeeAndPatch();
      });
  }

  // ----------------------------------------
  // loaders that return Promises so we can await them in ngOnInit
  // ----------------------------------------
  private loadAccounts(): Promise<void> {
    return new Promise(resolve => {
      this.accountService.getAll().pipe(first()).subscribe({
        next: data => {
          this.accounts = data || [];
          resolve();
        },
        error: err => {
          console.error('loadAccounts error', err);
          this.accounts = [];
          resolve();
        }
      });
    });
  }

  private loadDepartments(): Promise<void> {
    return new Promise(resolve => {
      this.departmentService.getAll().pipe(first()).subscribe({
        next: data => {
          this.departments = data || [];
          resolve();
        },
        error: err => {
          console.error('loadDepartments error', err);
          this.departments = [];
          resolve();
        }
      });
    });
  }

  private loadPositions(): Promise<void> {
    return new Promise(resolve => {
      this.positionService.getAll().pipe(first()).subscribe({
        next: data => {
          this.positions = data || [];
          resolve();
        },
        error: err => {
          console.error('loadPositions error', err);
          this.positions = [];
          resolve();
        }
      });
    });
  }

  // ----------------------------------------
  // load employee and patch the form (robust mapping)
  // ----------------------------------------
  private loadEmployeeAndPatch(): void {
    if (!this.EmployeeID) return;
    this.loading = true;
    console.log('[loadEmployee] id=', this.EmployeeID);

    this.employeeService.getById(this.EmployeeID).pipe(first()).subscribe({
      next: (emp: any) => {
        console.log('[loadEmployee] raw employee:', emp);

        // Map department -> try several shapes your backend might return
        const deptCandidate =
          emp.departmentId ??
          emp.department_id ??
          (emp.department && (emp.department.id ?? emp.department.departmentId)) ??
          (emp.Department && (emp.Department.id ?? emp.Department.departmentId)) ??
          '';

        // Map other fields similarly (position/hireDate/status/headId)
        const mapped = {
          accountId: emp.accountId ?? emp.AccountID ?? emp.account?.id ?? emp.Account?.id ?? '',
          departmentId: deptCandidate,
          position: emp.position ?? emp.Position ?? emp.roleType ?? '',
          headId: emp.headId ?? emp.HeadID ?? emp.head?.employeeId ?? emp.Head?.EmployeeID ?? null,
          hireDate: (emp.hireDate ?? emp.HireDate ?? '')?.substring(0, 10) ?? '',
          status: emp.status ?? emp.Status ?? 'active'
        };

        console.log('[loadEmployee] mapped values to patch:', mapped);

        // Patch the form - since departments list is already loaded, the department select will match
        this.form.patchValue(mapped);

        // Ensure head visibility and manager list loaded if needed
        this.updateHeadVisibility(mapped.position);

        // small delay, then inspect validity / values
        setTimeout(() => {
          console.log('[loadEmployee] form after patch:', this.form.value, 'valid=', this.form.valid);
        }, 50);

        this.loading = false;
      },
      error: err => {
        console.error('[loadEmployee] error', err);
        this.loading = false;
      }
    });
  }

  // ----------------------------------------
  // head visibility: hide only when position is 'manager' (case-insensitive)
  // ----------------------------------------
  private updateHeadVisibility(position: string | null | undefined): void {
    if (!position) {
      this.showHeadDropdown = true;
      return;
    }

    const p = String(position).toLowerCase();
    if (p === 'manager') {
      this.showHeadDropdown = false;
      // clear any previous headId to avoid stale submissions
      this.form.patchValue({ headId: null });
    } else {
      this.showHeadDropdown = true;
      // ensure managers are loaded when showing
      this.loadManagers();
    }
  }

  private loadManagers(): void {
    this.employeeService.getManagers().pipe(first()).subscribe({
      next: data => {
        // expecting objects with either employeeId or EmployeeID and names
        this.managers = (data || []).map((m: any) => {
          return {
            employeeId: m.employeeId ?? m.EmployeeID ?? m.EmployeeIDString ?? '',
            firstName: m.firstName ?? m.Account?.firstName ?? m.Account?.first_name ?? m.first_name ?? '',
            lastName: m.lastName ?? m.Account?.lastName ?? m.Account?.last_name ?? m.last_name ?? ''
          };
        }).filter((m: any) => m.employeeId); // only include ones with id
      },
      error: err => {
        console.error('loadManagers error', err);
        this.managers = [];
      }
    });
  }

  // ----------------------------------------
  // department changed -> optionally prefill headId from department-specific endpoint
  // ----------------------------------------
  onDepartmentChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const deptId = select?.value;
    if (!deptId) return;

    this.employeeService.getHeadByDepartment(+deptId).pipe(first()).subscribe({
      next: (head: any) => {
        const headId = head?.EmployeeID ?? head?.employeeId ?? head?.id ?? null;
        console.log('[onDepartmentChange] deptId=', deptId, 'head=', head);
        this.form.patchValue({ headId: headId ?? null });
      },
      error: err => console.error('getHeadByDepartment error', err)
    });
  }

  // ----------------------------------------
  // submit
  // ----------------------------------------
  onSubmit(): void {
    this.submitting = true;
    if (this.form.invalid) {
      console.warn('[submit] form invalid', this.form.value);
      this.submitting = false;
      return;
    }

    const payload = { ...this.form.value };
    console.log('[submit] payload', payload);

    const req$ = this.isAddMode ? this.employeeService.create(payload) : this.employeeService.update(this.EmployeeID!, payload);

    req$.pipe(first()).subscribe({
      next: () => {
        alert(`Employee ${this.isAddMode ? 'created' : 'updated'} successfully`);
        this.router.navigate(['/admin/employees']);
      },
      error: err => {
        console.error('[submit] error', err);
        this.submitting = false;
      }
    });
  }
}
