export interface Request {
  id?: number;              // request ID
  accountId: number;        // foreign key to employee/account
  type: string;             // Equipment, Leave, Resources
  items: RequestItem[];     // array of items with name and quantity
  status?: string;          // optional: Pending, Approved, etc.

  // Navigation property to show employee info in tables
  Employee?: {
    EmployeeID: string;
    position?: string;
  };
}

export interface RequestItem {
  name: string;
  quantity: number;
}
