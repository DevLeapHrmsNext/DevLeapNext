export interface LeaveTypeModel {
  status: number  
  message: string
    data: LeaveType[]
  }
  
  export interface LeaveType {
    leave_id: string
    created_at: string
    leave_name: string
    leave_discription: string
    leave_category: string
    leave_count: number
    leave_accrual: string
    client_id: number
    branch_id: number
    gender: string
    user_role_applicable: string
    if_unused: string
    validPeriod: string
    leap_leave_type_icon_and_color:LeaveTypeIconAndColor
  }

  export interface LeaveTypeIconAndColor{
    leave_type_icon_id:any
    icon_url:any
    bg_color:any
  }
  
  export interface AssignLeaveModel {
    message: string
    data: AssignLeave[]
  }
  
  export interface AssignLeave {
    id: number
    created_at: string
    customer_id: number
    client_id: number
    leave_type: number
    from_date: string
    to_date: string
    total_days: number
    approved_by_id: any
    leave_status: number
    leave_reason: string
    approve_disapprove_remark: any
    attachments: any
    branch_id: number
    updated_at: string
    isAssigned: boolean
    duration: string
  }

  export interface AppliedLeaveModel {
    message: string
    status: number
    leavedata: AppliedLeave[]
  }
  
  export interface AppliedLeave {
    id: number
  created_at: string
  customer_id: number
  client_id: number
  leave_type: number
  from_date: string
  to_date: string
  total_days: number
  approved_by_id: any
  leave_status: number
  leave_reason: string
  approve_disapprove_remark: any
  attachments: any
  branch_id: number
  updated_at: string
  isAssigned: boolean
  duration: string
  leap_approval_status: LeapApprovalStatus
  leap_client_leave: LeapClientLeave
  leap_customer: LeapCustomer
}

export interface LeapApprovalStatus {
  approval_type: string
}

export interface LeapClientLeave {
  leave_name: string
}

export interface LeapCustomer {
  name: string
}



export interface LeaveData {
  from_date: string;
  to_date: string;
  total_days: number;
  leave_status: number;
  approve_disapprove_remark?: string | null;
  leap_client_leave?: {
    gender: string;
    if_unused: string;
    leave_name: string;
    leave_count: number;
    validPeriod: string;
    leave_accrual: string;
    leave_category: string;
    user_role_applicable: string;
  };
  leap_customer?: {
    name: string;
    emp_id: string;
  };
}

export interface EmpLeaveBalances {
  customer_id: number
  joiningDate: string
  leaveStatusPendingCount: number
  LeaveStatusAprovedCount: number
  LeaveStatusRejectedCount: number
  total_Leave_balance: number
  total_applied_days: number
  customerLeavePendingCount: CustomerLeavePendingCount[]
}

export interface CustomerLeavePendingCount {
  leaveTypeId: number
  leaveType: string
  leaveAllotedCount: number
  totalAppliedLeaveDays: number
  leaveBalance: number
  color_code:any
}


//////////////////////ritika code merge changes



export interface LeaveBalanceModel {
  message: string
  status: number
  data: Balance
}

export interface Balance {
  customer_id: number
  joiningDate: string
  client_id: number
  branch_id: number
  leaveStatusPendingCount: number
  LeaveStatusAprovedCount: number
  LeaveStatusRejectedCount: number
  leave_balances: LeaveBalance[]
}

export interface LeaveBalance {
  leaveTypeId: number
  leaveType: string
  leaveAllotedCount: number
  totalAppliedLeaveDays: number
  leaveBalance: number
}

export interface EmployeeLeave {
  message: string
  leavedata: EmpLeave[]
  status: number
  emp_leave_Balances: EmpLeaveBalances
}

export interface EmpLeave {
  id: number
  created_at: string
  customer_id: number
  client_id: number
  leave_type: number
  from_date: string
  to_date: string
  total_days: number
  approved_by_id?: number
  leave_status: number
  leave_reason: string
  approve_disapprove_remark?: string
  attachments?: string
  branch_id: number
  updated_at: string
  isAssigned: boolean
  duration: string
  leap_approval_status: LeapApprovalStatus
  leap_client_leave: LeapClientLeave
  leap_customer: LeapCustomer
}


export interface EmpLeaveBalances {
  customer_id: number
  joiningDate: string
  leaveStatusPendingCount: number
  LeaveStatusAprovedCount: number
  LeaveStatusRejectedCount: number
  total_Leave_balance: number
  total_applied_days: number
  customerLeavePendingCount: CustomerLeavePendingCount[]
}

export interface CustomerLeavePendingCount {
  leaveTypeId: number
  leaveType: string
  leaveAllotedCount: number
  totalAppliedLeaveDays: number
  leaveBalance: number
}


export interface EmployeeLeave_Approval_LeaveType {
  id: number
  created_at: string
  customer_id: number
  client_id: number
  leave_type: number
  from_date: string
  to_date: string
  total_days: number
  approved_by_id: number
  leave_status: number
  leave_reason: string
  approve_disapprove_remark: any
  attachments: any
  branch_id: number
  updated_at: string
  isAssigned: boolean
  duration: string
  leap_approval_status: LeapApprovalStatus
  leap_client_leave: LeapClientLeave
}


// export interface LeaveTypeModel {
//   status: number  
//   message: string
//     data: LeaveType[]
//   }
  
//   export interface LeaveType {
//     leave_id: string
//     created_at: string
//     leave_name: string
//     leave_discription: string
//     leave_category: string
//     leave_count: number
//     leave_accrual: string
//     client_id: number
//     branch_id: number
//     gender: string
//     user_role_applicable: string
//     if_unused: string
//     validPeriod: string
    
//   color_code: string
//   icon_url: string
//   icon_type_id: string
//   }
  
//   export interface AssignLeaveModel {
//     message: string
//     data: AssignLeave[]
//   }
  
//   export interface AssignLeave {
//     id: number
//     created_at: string
//     customer_id: number
//     client_id: number
//     leave_type: number
//     from_date: string
//     to_date: string
//     total_days: number
//     approved_by_id: any
//     leave_status: number
//     leave_reason: string
//     approve_disapprove_remark: any
//     attachments: any
//     branch_id: number
//     updated_at: string
//     isAssigned: boolean
//     duration: string
//   }

//   export interface AppliedLeaveModel {
//     message: string
//     status: number
//     leavedata: AppliedLeave[]
//   }
  
//   export interface AppliedLeave {
//     id: number
//   created_at: string
//   customer_id: number
//   client_id: number
//   leave_type: number
//   from_date: string
//   to_date: string
//   total_days: number
//   approved_by_id: any
//   leave_status: number
//   leave_reason: string
//   approve_disapprove_remark: any
//   attachments: any
//   branch_id: number
//   updated_at: string
//   isAssigned: boolean
//   duration: string
//   leap_approval_status: LeapApprovalStatus
//   leap_client_leave: LeapClientLeave
//   leap_customer: LeapCustomer
// }

// export interface LeapApprovalStatus {
//   approval_type: string
// }

// export interface LeapClientLeave {
//   leave_name: string
// }

// export interface LeapCustomer {
//   name: string
// }



// export interface LeaveData {
//   from_date: string;
//   to_date: string;
//   total_days: number;
//   leave_status: number;
//   approve_disapprove_remark?: string | null;
//   leap_client_leave?: {
//     gender: string;
//     if_unused: string;
//     leave_name: string;
//     leave_count: number;
//     validPeriod: string;
//     leave_accrual: string;
//     leave_category: string;
//     user_role_applicable: string;
//   };
//   leap_customer?: {
//     name: string;
//     emp_id: string;
//   };
// }

// export interface EmpLeaveBalances {
//   customer_id: number
//   joiningDate: string
//   leaveStatusPendingCount: number
//   LeaveStatusAprovedCount: number
//   LeaveStatusRejectedCount: number
//   total_Leave_balance: number
//   total_applied_days: number
//   customerLeavePendingCount: CustomerLeavePendingCount[]
// }

// export interface CustomerLeavePendingCount {
//   leaveTypeId: number
//   leaveType: string
//   leaveAllotedCount: number
//   totalAppliedLeaveDays: number
//   leaveBalance: number
//   color_code:any
// }


// //////////////////////ritika code merge changes



// export interface LeaveBalanceModel {
//   message: string
//   status: number
//   data: Balance
// }

// export interface Balance {
//   customer_id: number
//   joiningDate: string
//   client_id: number
//   branch_id: number
//   leaveStatusPendingCount: number
//   LeaveStatusAprovedCount: number
//   LeaveStatusRejectedCount: number
//   leave_balances: LeaveBalance[]
// }

// export interface LeaveBalance {
//   leaveTypeId: number
//   leaveType: string
//   leaveAllotedCount: number
//   totalAppliedLeaveDays: number
//   leaveBalance: number
// }

// export interface EmployeeLeave {
//   message: string
//   leavedata: EmpLeave[]
//   status: number
//   emp_leave_Balances: EmpLeaveBalances
// }

// export interface EmpLeave {
//   id: number
//   created_at: string
//   customer_id: number
//   client_id: number
//   leave_type: number
//   from_date: string
//   to_date: string
//   total_days: number
//   approved_by_id?: number
//   leave_status: number
//   leave_reason: string
//   approve_disapprove_remark?: string
//   attachments?: string
//   branch_id: number
//   updated_at: string
//   isAssigned: boolean
//   duration: string
//   leap_approval_status: LeapApprovalStatus
//   leap_client_leave: LeapClientLeave
//   leap_customer: LeapCustomer
// }


// export interface EmpLeaveBalances {
//   customer_id: number
//   joiningDate: string
//   leaveStatusPendingCount: number
//   LeaveStatusAprovedCount: number
//   LeaveStatusRejectedCount: number
//   total_Leave_balance: number
//   total_applied_days: number
//   customerLeavePendingCount: CustomerLeavePendingCount[]
// }

// export interface CustomerLeavePendingCount {
//   leaveTypeId: number
//   leaveType: string
//   leaveAllotedCount: number
//   totalAppliedLeaveDays: number
//   leaveBalance: number
// }


// export interface EmployeeLeave_Approval_LeaveType {
//   id: number
//   created_at: string
//   customer_id: number
//   client_id: number
//   leave_type: number
//   from_date: string
//   to_date: string
//   total_days: number
//   approved_by_id: number
//   leave_status: number
//   leave_reason: string
//   approve_disapprove_remark: any
//   attachments: any
//   branch_id: number
//   updated_at: string
//   isAssigned: boolean
//   duration: string
//   leap_approval_status: LeapApprovalStatus
//   leap_client_leave: LeapClientLeave
// }