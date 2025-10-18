import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PositionsRoutingModule } from './positions-routing.module';

import { ListComponent } from './positions-list.component';
import { AddEditComponent } from './positions-add-edit.component';

@NgModule({
  declarations: [
    ListComponent,
    AddEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PositionsRoutingModule
  ]
})
export class PositionsModule {}
