// app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

// Lazy-loaded modules
const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);

// Admin module (Accounts only)
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
//const adminAccountModule = () => import('./admin/admin.module').then(x => x.AdminModule);

// User feature modules
const employeesModule = () => import('./admin/employees/employees.module').then(x => x.EmployeesModule);
const departmentsModule = () => import('./admin/departments/departments.module').then(x => x.DepartmentsModule);
const requestsModule = () => import('./admin/requests/requests.module').then(x => x.RequestsModule);
const positionsModule = () => import('./admin/positions/positions.module').then(x => x.PositionsModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },
  { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },

  // 🔹 Admin (Accounts only)
  { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard]/*, data: { roles: [Role.Admin] }*/ },
  //{ path: 'accounts', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },

  // 🔹 User (Employees, Departments, Requests only)
  { path: 'employees', loadChildren: employeesModule, canActivate: [AuthGuard]/*, data: { roles: [Role.Admin, Role.User] }*/ },
  { path: 'departments', loadChildren: departmentsModule, canActivate: [AuthGuard]/*, data: { roles: [Role.Admin, Role.User] }*/ },
  { path: 'requests', loadChildren: requestsModule, canActivate: [AuthGuard]/*, data: { roles: [Role.Admin, Role.User] } */},
  { path: 'positions', loadChildren: positionsModule, canActivate: [AuthGuard]/*, data: { roles: [Role.Admin, Role.User]}*/ },

  // Otherwise redirect
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
