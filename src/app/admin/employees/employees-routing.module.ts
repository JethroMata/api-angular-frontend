import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeAddEditComponent } from './employee-add-edit.component';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeWorkflowComponent } from './employee-workflow.component';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'add', component: EmployeeAddEditComponent },
  { path: 'edit/:id', component: EmployeeAddEditComponent },
  { path: 'workflows/:id', component: EmployeeWorkflowComponent },
  { path: ':id/workflow', component: EmployeeWorkflowComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule {}
