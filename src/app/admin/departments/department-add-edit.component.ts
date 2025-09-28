import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '@app/_services/department.service';
import { Department } from '@app/_models/department';

@Component({
  selector: 'app-department-add-edit',
  templateUrl: './department-add-edit.component.html'
})
export class DepartmentAddEditComponent implements OnInit {
  form!: FormGroup;
  id!: string;
  isAddMode = true;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      departmentName: ['', Validators.required],
      description: ['']
    });

    if (!this.isAddMode) {
      this.departmentService.getById(+this.id).subscribe(dept => {
        this.form.patchValue(dept);
      });
    }
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    if (this.isAddMode) this.createDepartment();
    else this.updateDepartment();
  }

  private createDepartment(): void {
    this.departmentService.create(this.form.value).subscribe({
      next: () => {
        alert('Department created successfully!');
        this.router.navigate(['/admin/departments']);
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  private updateDepartment(): void {
    this.departmentService.update(+this.id, this.form.value).subscribe({
      next: () => {
        alert('Department updated successfully!');
        this.router.navigate(['/admin/departments']);
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
