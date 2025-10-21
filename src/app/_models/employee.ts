export interface Employee {
  EmployeeID: string;
  position: string;
  hireDate: string;
  status: string;

  accountId: number;
  departmentId?: number;
  positionId?: number;
  headId?: string | null; // ✅ same type as EmployeeID (varchar)

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

  Head?: { // ✅ this matches your backend alias
    EmployeeID?: string;
    Account?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
}
