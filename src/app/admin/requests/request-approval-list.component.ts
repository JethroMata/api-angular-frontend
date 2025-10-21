import { Component, OnInit } from '@angular/core';
import { RequestService } from '@app/_services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-approval-list',
  templateUrl: './request-approval-list.component.html',
  styleUrls: ['./request-approval-list.component.css']
})
export class RequestApprovalListComponent implements OnInit {
  requests: any[] = [];
  loading = false;
  message = '';

  constructor(
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  // 🔹 Load pending requests
  loadPendingRequests(): void {
    this.loading = true;
    this.requestService.getPending().subscribe({
      next: (res) => {
        this.requests = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading pending requests:', err);
        this.loading = false;
      }
    });
  }

  // 🔹 Approve a request
  approveRequest(id: number): void {
    if (!confirm('Are you sure you want to approve this request?')) return;

    this.requestService.approve(id).subscribe({
      next: () => {
        alert('✅ Request approved successfully!');
        this.loadPendingRequests();
      },
      error: (err) => {
        console.error('Error approving request:', err);
        alert('❌ Failed to approve request. Please try again.');
      }
    });
  }

  // 🔹 Reject a request
  rejectRequest(id: number): void {
    if (!confirm('Are you sure you want to reject this request?')) return;

    this.requestService.reject(id).subscribe({
      next: () => {
        alert('🚫 Request rejected successfully!');
        this.loadPendingRequests();
      },
      error: (err) => {
        console.error('Error rejecting request:', err);
        alert('❌ Failed to reject request. Please try again.');
      }
    });
  }

  // 🔹 Navigate back
  goBack(): void {
    this.router.navigate(['/admin/requests']);
  }
}
