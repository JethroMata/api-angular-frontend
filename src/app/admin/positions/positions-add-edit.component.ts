import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionService } from '@app/_services/position.service'; // ✅ FIXED PATH

@Component({
  selector: 'app-add-edit-position',
  templateUrl: './positions-add-edit.component.html',
  styleUrls: ['./positions-list.component.css']
})
export class AddEditComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  title = 'Add Position';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private positionService: PositionService
  ) {}

 ngOnInit() {
  this.form = this.fb.group({
    roleType: ['', Validators.required],
    status: ['', Validators.required]   // ✅ Add this line
  });

  this.id = Number(this.route.snapshot.paramMap.get('id'));
  if (this.id) {
    this.title = 'Edit Position';
    this.loadPosition();
  }
}

  // ✅ Load existing position data when editing
  private loadPosition(): void {
    this.positionService.getById(this.id!).subscribe({
      next: (pos: any) => this.form.patchValue(pos),
      error: (err: any) => {
        console.error('Failed to load position:', err);
        alert('Could not load position details.');
        this.router.navigate(['/admin/positions']);
      }
    });
  }

  // ✅ Handle form submission (Add / Edit)
  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;

    const request = this.id
      ? this.positionService.update(this.id, this.form.value)
      : this.positionService.create(this.form.value);

    request.subscribe({
      next: () => {
        alert(`Position ${this.id ? 'updated' : 'added'} successfully!`);
        this.router.navigate(['/admin/positions']);
      },
      error: (err: any) => {
        console.error('Error saving position:', err);
        alert('Failed to save position.');
        this.submitting = false;
      }
    });
  }

  // ✅ Cancel and go back
  cancel(): void {
    this.router.navigate(['/admin/positions']);
  }
}
