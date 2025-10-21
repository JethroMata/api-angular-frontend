import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '@app/_services/request.service';
import { AccountService } from '@app/_services/account.service';

@Component({
  selector: 'app-request-add-edit',
  templateUrl: './request-add-edit.component.html'
})
export class RequestAddEditComponent implements OnInit {
  form!: FormGroup;
  isAddMode = true;
  id!: number;
  loading = false;
  canEdit = true;
  statusMessage = '';
  statusColor = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.fb.group({
      accountId: [''],
      type: ['', Validators.required],
      items: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['draft']
    });

    // Auto-fill current user account
    const currentUser = this.accountService.accountValue;
    if (currentUser) {
      this.form.patchValue({ accountId: currentUser.id });
    }

    if (!this.isAddMode) {
      this.loadRequest();
    }
  }

  loadRequest(): void {
    this.requestService.getById(this.id).subscribe({
      next: (req) => {
        this.form.patchValue(req);
        const status = req.status?.toLowerCase();

        // Disable editing for approved/rejected/pending
        if (['pending', 'approved', 'rejected'].includes(status)) {
          this.form.disable();
          this.canEdit = false;
          this.setStatusMessage(status);
        }
      },
      error: (err) => console.error('Error loading request:', err)
    });
  }

  private setStatusMessage(status: string) {
    const formatted = status.toUpperCase();
    switch (status) {
      case 'pending':
        this.statusColor = 'info';
        this.statusMessage = `This request cannot be edited because its status is ${formatted}.`;
        break;
      case 'approved':
        this.statusColor = 'success';
        this.statusMessage = `This request cannot be edited because its status is ${formatted}.`;
        break;
      case 'rejected':
        this.statusColor = 'danger';
        this.statusMessage = `This request cannot be edited because its status is ${formatted}.`;
        break;
      default:
        this.statusMessage = '';
    }
  }

  saveDraft(): void {
    if (this.form.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = { ...this.form.value, status: 'draft' };
    this.loading = true;

    const request$ = this.isAddMode
      ? this.requestService.create(payload)
      : this.requestService.update(this.id, payload);

    request$.subscribe({
      next: () => {
        alert('Request saved as draft.');
        this.router.navigate(['/admin/requests']);
      },
      error: (err) => {
        console.error('Error saving draft:', err);
        alert('Failed to save draft.');
        this.loading = false;
      }
    });
  }

  submitForApproval(): void {
    if (this.form.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = { ...this.form.value, status: 'pending' };
    this.loading = true;

    const request$ = this.isAddMode
      ? this.requestService.create(payload)
      : this.requestService.update(this.id, payload);

    request$.subscribe({
      next: () => {
        alert('Request submitted for approval.');
        this.router.navigate(['/admin/requests']);
      },
      error: (err) => {
        console.error('Error submitting for approval:', err);
        alert('Failed to submit request.');
        this.loading = false;
      }
    });
  }
}
