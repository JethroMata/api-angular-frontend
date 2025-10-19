import { Account } from './account';

export interface Employee {
  EmployeeID: string;
  position: string;
  hireDate: string;
  status: string;

  positionId?: number;
  headId?: number | null;

  // 👇 Fix starts here
  Head?: {
    EmployeeID?: string;
    Account?: {
      id?: number;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
  // 👆 Head now matches backend structure

  accountId: number;
  departmentId?: number;

  Account?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };

  Department?: {
    id: number;
    departmentName: string;
    employeeCounts?: number;
  };

  
}
