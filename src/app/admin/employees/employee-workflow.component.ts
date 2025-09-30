import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '@app/_services/employee.service';

@Component({
  selector: 'app-employee-workflow',
  templateUrl: './employee-workflow.component.html',
  //styleUrls: ['./employee-workflow.component.css']
})
export class EmployeeWorkflowComponent implements OnInit {
  employeeId!: string;
  workflows: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.loadWorkflow();
    });
  }

  loadWorkflow(): void {
    this.loading = true;
    this.employeeService.getWorkflow(this.employeeId).subscribe({
      next: (data) => {
        this.workflows = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load workflow', err);
        this.loading = false;
      }
    });
  }

  backToEmployees(): void {
    this.router.navigate(['/admin/employees']);
  }
}
