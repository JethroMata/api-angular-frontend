import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '@app/_services/request.service';
import { EmployeeService } from '@app/_services/employee.service';
import { Request } from '@app/_models/request';

interface Employee {
  EmployeeID: string;
  Account?: { id: number; email: string };
}

@Component({
  selector: 'app-request-add-edit',
  templateUrl: './request-add-edit.component.html'
})
export class RequestAddEditComponent implements OnInit {
  form!: FormGroup;
  isAddMode = true;
  loading = false;
  submitted = false;
  employees: Employee[] = [];
  id!: number;

  // ✅ store email separately for readonly display
  employeeEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.fb.group({
      employeeId: ['', Validators.required],
      type: ['', Validators.required],
      items: this.fb.array([], Validators.required),
      status: [this.isAddMode ? 'pending' : '', Validators.required]
    });

    this.employeeService.getAll().subscribe({
      next: (res: Employee[]) => {
        this.employees = res;

        if (this.isAddMode) {
          this.addItem();
        } else {
          this.loadRequest();
        }
      },
      error: err => console.error('Error loading employees', err)
    });
  }

  get itemsFormArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(name: string = '', quantity: number = 1): void {
    this.itemsFormArray.push(
      this.fb.group({
        name: [name, Validators.required],
        quantity: [quantity, [Validators.required, Validators.min(1)]]
      })
    );
  }

  removeItem(index: number): void {
    if (this.itemsFormArray.length > 1) {
      this.itemsFormArray.removeAt(index);
    }
  }

  loadRequest(): void {
    this.requestService.getById(this.id).subscribe((req: any) => {
      console.log('Loaded request:', req);

      this.form.patchValue({
        employeeId: req.accountId,
        type: req.type,
        status: req.status
      });

      // ✅ capture the Account email for readonly display
      this.employeeEmail = req.Account?.email || '';

      this.itemsFormArray.clear();
      if (req.items) {
        const itemNames =
          typeof req.items === 'string'
            ? req.items.split(',').map((n: string) => n.trim())
            : [];
        if (itemNames.length > 0) {
          itemNames.forEach((name: string) => {
            this.addItem(name, req.quantity || 1);
          });
        } else {
          this.addItem();
        }
      } else {
        this.addItem();
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      alert('Please fill all required fields!');
      return;
    }

    this.loading = true;

    const itemsArray = this.itemsFormArray.value;
    const itemsString = itemsArray.map((i: any) => i.name).join(', ');
    const totalQuantity = itemsArray.reduce(
      (sum: number, i: any) => sum + Number(i.quantity),
      0
    );

    const payload = {
      accountId: this.form.value.employeeId,
      type: this.form.value.type,
      items: itemsString,
      quantity: totalQuantity,
      status: this.form.value.status
    };

    const requestObservable = this.isAddMode
      ? this.requestService.create(payload)
      : this.requestService.update(this.id, payload);

    requestObservable.subscribe({
      next: () => {
        alert(this.isAddMode ? 'Request created successfully!' : 'Request updated successfully!');
        this.router.navigate(['/admin/requests']);
      },
      error: err => {
        console.error('Error:', err);
        alert('Error: ' + (err.error?.message || 'Unknown error'));
        this.loading = false;
      }
    });
  }
}