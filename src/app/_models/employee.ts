export interface Employee {
  EmployeeID: string; // backend uses EmployeeID, not id
  position: string;
  hireDate: string; // ISO string
  status: string; // 'active' or 'inactive'

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
