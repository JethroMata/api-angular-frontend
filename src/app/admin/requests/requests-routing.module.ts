import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListComponent } from './request-list.component';
import { RequestAddEditComponent } from './request-add-edit.component';
import { RequestApprovalListComponent } from './request-approval-list.component';

const routes: Routes = [
  { path: '', component: RequestListComponent },
  { path: 'add', component: RequestAddEditComponent },
  { path: 'edit/:id', component: RequestAddEditComponent },
  { path: 'approval', component: RequestApprovalListComponent } // ✅ new route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule {}
