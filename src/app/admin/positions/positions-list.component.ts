import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PositionService } from '@app/_services/position.service'; // ✅ Use relative path if @app alias not working
import { Position } from '@app/_models/position'; // optional model for type safety

@Component({
  selector: 'app-position-list',
  templateUrl: './positions-list.component.html',
  styleUrls: ['./positions-list.component.css']
})
export class ListComponent implements OnInit {
  positions: Position[] = [];
  loading = true;

  constructor(
    private router: Router,
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    this.loadPositions();
  }

  /** ✅ Load all positions from backend */
  loadPositions(): void {
    this.loading = true;
    this.positionService.getAll().subscribe({
      next: (data: Position[]) => {
        this.positions = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Failed to load positions:', err);
        this.loading = false;
        alert('Failed to load positions. Please try again later.');
      }
    });
  }

  /** ✅ Navigate to Add form */
  addPosition(): void {
    this.router.navigate(['admin/positions/add']);
  }

  /** ✅ Navigate to Edit form */
  editPosition(id: number): void {
    this.router.navigate(['admin/positions/edit', id]);
  }

  /** ✅ Delete position with confirmation */
  deletePosition(position: Position): void {
    if (!confirm(`Are you sure you want to delete "${position.roleType}"?`)) return;

    this.positionService.delete(position.id).subscribe({
      next: () => {
        this.positions = this.positions.filter(p => p.id !== position.id);
        alert('Position deleted successfully.');
      },
      error: (err: any) => {
        console.error('❌ Delete failed:', err);
        alert('Failed to delete position.');
      }
    });
  }
}
