interface LeapClientSalaryComponents {
    id: number
    client_id: number
    branch_id: number
    salary_component_id: number
    is_active: boolean
    created_at: string
    updated_at: string
    pay_accural: number
    leap_salary_components: LeapPayrollSalaryComponents
    leap_salary_payable_days: LeapPayrollSalaryPayableDays
  }

  interface LeapPayrollSalaryComponents {
    id: number
    salary_add: boolean
    salary_component_name: string
    is_other_component_client_id:any
  }

  interface LeapPayrollSalaryPayableDays {
    id:any
    payable_time: string
  }

  interface PayAccuralTable {
    id: number
    payable_time: string
  }


  interface UpdateComponentDataModel {
    isAddComponent:boolean
    main_component_id: number
    client_component_id: number
    branch_id: number
    pay_accural: string,
    enabled: boolean,
    isOtherComponentByClient:boolean
  }




  interface PayrollResponseSendModel{
      emp_id:any,
      customer_id:any,
      emp_name:any,
      basic_pay:any,
      actual_gross:any
      actual_net:any
      actual_deductions:any
      gross_salary:any,
      net_salary:any,
      total_deduction:any,
      pay_accural_type:any,
      total_working_hours:any,
      total_working_days:any,
      total_applied_leave:any,
      total_paid_leaves_days:any,
      total_unpaid_leaves_days:any,
      total_holidays:any,
      num_of_weeks:any,
      month:any,
  }

  interface ParsingLeaveRecords {
    from_date: string
    to_date: string
    total_days: number
    leave_status: number
    leap_client_leave: ParingLeapClientLeave
  }
  interface ParingLeapClientLeave {
    gender: string
    leave_id: number
    branch_id: number
    client_id: number
    if_unused: string
    created_at: string
    leave_name: string
    leave_count: number
    validPeriod: string
    leave_accrual: string
    leave_category: string
    leave_discription: string
    user_role_applicable: string
  }

  interface TotalPaySendModel{
    totalEmployees:any,
    totalExpensePay:any,
    totalDeductions:any,
    
  }


  interface EmpPayrollResponseModel{
    emp_id: string
  customer_id: number
  emp_name: string
  gross_salary: number,
  net_salary: number,
  total_deduction: number,
  pay_accural_type: number,
  total_working_hours: number,
  total_applied_leave: number,
  month: string,
  total_working_days: number,
  num_of_weeks: number,
  total_holidays: number,
  total_paid_leaves_days: number,
  total_unpaid_leaves_days: number,
  }

  interface TotalPayrollResponse {
    totalEmployees: number
    totalExpensePay: number
    totalDeductions: number
  }