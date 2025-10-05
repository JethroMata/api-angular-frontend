import { Component, OnInit } from '@angular/core';
import { RequestService } from '@app/_services/request.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
    styleUrls: ['./request-list.component.css']
})  
export class RequestListComponent implements OnInit {
  requests: any[] = [];
  loading = false;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
  this.loading = true;
  this.requestService.getAll().subscribe({
    next: res => {
      // ✅ Sort ascending by requestId
      this.requests = res.sort((a: any, b: any) => {
        const numA = parseInt(a.requestId?.toString().replace(/\D/g, ''), 10);
        const numB = parseInt(b.requestId?.toString().replace(/\D/g, ''), 10);
        return numA - numB; // ascending
      });

      this.loading = false;
    },
    error: err => {
      console.error('Error loading requests', err);
      this.loading = false;
    }
  });
}


  deleteRequest(id: number): void {
    if (!confirm('Are you sure you want to delete this request?')) return;
    this.requestService.delete(id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.requestId !== id);
        alert('Request deleted successfully.');
      },
      error: err => console.error('Error deleting request', err)
    });
  }
}
