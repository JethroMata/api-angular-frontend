import { Component, OnInit } from '@angular/core';
import { RequestService } from '@app/_services/request.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  loading = false;
  filterActive = false;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.requestService.getAll().subscribe({
      next: res => {
        // Sort by requestId ascending
        this.requests = res.sort((a: any, b: any) => a.requestId - b.requestId);
        this.filteredRequests = [...this.requests];
        this.loading = false;
      },
      error: err => {
        console.error('Error loading requests', err);
        this.loading = false;
      }
    });
  }

  filterForApproval(): void {
    if (this.filterActive) {
      this.filteredRequests = [...this.requests];
      this.filterActive = false;
    } else {
      this.filteredRequests = this.requests.filter(r => r.status === 'pending');
      this.filterActive = true;
    }
  }

  deleteRequest(id: number): void {
    if (!confirm('Are you sure you want to delete this request?')) return;
    this.requestService.delete(id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.requestId !== id);
        this.filteredRequests = [...this.requests];
        alert('Request deleted successfully.');
      },
      error: err => console.error('Error deleting request', err)
    });
  }
}
