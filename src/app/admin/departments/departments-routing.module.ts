import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './department-list.component';
import { DepartmentAddEditComponent } from './department-add-edit.component';

const routes: Routes = [
  { path: '', component: DepartmentListComponent },
  { path: 'add', component: DepartmentAddEditComponent },
  { path: 'edit/:id', component: DepartmentAddEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentsRoutingModule {}
