import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestsRoutingModule } from './requests-routing.module';

import { RequestListComponent } from './request-list.component';
import { RequestAddEditComponent } from './request-add-edit.component';

@NgModule({
  declarations: [
    RequestListComponent,
    RequestAddEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RequestsRoutingModule
  ]
})
export class RequestsModule {}
