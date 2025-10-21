import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { Account, Role } from '@app/_models'; // ✅ Import Role here

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
  account?: Account | null;
  Role = Role; // ✅ Make Role accessible in HTML

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService.account.subscribe((x: Account | null) => {
      this.account = x;
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/account/login']);
  }
}
