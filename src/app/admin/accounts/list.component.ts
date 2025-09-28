import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ 
    templateUrl: 'list.component.html', 
    styleUrls: ['./list.component.css'], // <-- Corrected syntax for styleUrls
    encapsulation: ViewEncapsulation.None // <-- ADDED to ensure header/background styles work
})
export class ListComponent implements OnInit {
    accounts?: any[];

    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }

    deleteAccount(id: string) {
        const account = this.accounts!.find(x => x.id === id);
        account.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.accounts = this.accounts!.filter(x => x.id !== id)
            });
    }
}