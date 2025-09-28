import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeAddEditComponent } from './employee-add-edit.component';

@NgModule({
  declarations: [EmployeeListComponent, EmployeeAddEditComponent],
  imports: [
    CommonModule,
    FormsModule,            
    ReactiveFormsModule,
    EmployeesRoutingModule
  ]
})
export class EmployeesModule {}
