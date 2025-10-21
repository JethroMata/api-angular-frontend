import { Component, OnInit } from '@angular/core';
import { RequestService } from '@app/_services/request.service';

@Component({
  selector: 'app-request-for-approval',
  templateUrl: './request-for-approval.component.html'
})
export class RequestForApprovalComponent implements OnInit {
  requests: any[] = [];

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests(): void {
    this.requestService.getPending().subscribe({
      next: (res) => (this.requests = res),
      error: (err) => console.error('Error loading pending requests:', err)
    });
  }

  approve(id: number): void {
    if (confirm('Approve this request?')) {
      this.requestService.approve(id).subscribe({
        next: () => this.loadPendingRequests(),
        error: (err) => console.error('Error approving request:', err)
      });
    }
  }

  reject(id: number): void {
    if (confirm('Reject this request?')) {
      this.requestService.reject(id).subscribe({
        next: () => this.loadPendingRequests(),
        error: (err) => console.error('Error rejecting request:', err)
      });
    }
  }
}
