export interface DashboardModel {
    message: string
    clientList: any
    midShortcutsList: MidShortcutsList
    shortCutOne: ShortCutOne[]
    customerList: any
    employeeSummary: EmployeeSummary
    employees: Employees
    leaveRequest: LeaveRequest
    employeeAttendance: EmployeeAttendance
    holidayList: HolidayList
    upcommingHolidays: UpcommingHolidays
    myattendance: any[]
  }
  
  export interface EmployeeSummary {
    totalCount: number
    totalActive: number
    totalInactive: number
    branch: Branch[]
  }
  
  export interface Branch {
    branchId: number
    branchNumber: string
    branchTotalEmp: number
    branchTotalActiveEmp: number
    branchTotalOnLeaveEmp: number
  }
  
  export interface Employees {
    employeeCount: number
    employees: Employee[]
  }
  
  export interface Employee {
    id: string
    customer_id: number
    created_at: string
    name: string
    contact_number: string
    email_id: string
    dob: string
    client_id: number
    gender: string
    date_of_joining?: string
    employment_status: boolean
    device_id: string
    salary_structure: string
    user_role: number
    profile_pic: any
    emergency_contact: any
    contact_name: any
    relation: any
    manager_id?: number
    designation_id: number
    authUuid: string
    branch_id: number
    emp_id: string
    updated_at: string
    leap_user_role: LeapUserRole
    leap_client_designations: LeapDesignation
    leap_relations: any
    leap_customer_attendance: LeapCustomerAttendance[]
  }
  
  export interface LeapUserRole {
    id: number
    user_role: string
  }
  
  export interface LeapDesignation {
    id: number
    department: any
    leap_client_departments: LeapDepartment
    designation_name: string
  }
  export interface LeapDepartment {
    id: number
    is_active: boolean
    department_name: string
  }
  
  export interface LeapCustomerAttendance {
    date: string
    remark: any
    in_time: string
    out_time: any
    client_id: number
    if_paused: boolean
    created_at: any
    updated_at: string
    approved_by: any
    customer_id: number
    total_hours: any
    attendance_id: number
    img_attachment: string
    pause_end_time: any
    approval_status: any
    paused_duration: any
    working_type_id: any
    pause_start_time: any
  }
  
  export interface LeaveRequest {
    totalRequest: number
    employees: any[]
  }
  
  export interface EmployeeAttendance {
    totalActiveEmployees: number
    presentCount: number
    employees: EmpAttendance[]
  }

  export interface EmpAttendance{
    attendance_id: number
  date: string
  customer_id: number
  client_id: number
  in_time: string
  out_time: any
  working_type_id: any
  total_hours: any
  if_paused: boolean
  attendanceStatus: number
  remark: any
  approval_status: any
  approved_by: any
  paused_duration: any
  img_attachment: string
  pause_start_time: any
  pause_end_time: any
  updated_at: string
  created_at: any
  leap_customer: EmployeeName
  }

  export interface EmployeeName {
    name: string
  }
  
  export interface HolidayList {
    totalHolidays: number
    holidays: any[]
  }
  
  export interface UpcommingHolidays {
    totalHolidays: number
    holidays: any[]
  }

  export interface MidShortcutsList {
    shortcut: Shortcut
    related_data: ShrotCutRelatedData[]
  }
  
  export interface Shortcut {
    id: number
    mid_shortcut_id: number
    created_at: string
    updated_at: string
    show_on_dashboard: boolean
    client_id: number
    leap_dashboard_mid_shortcut: LeapDashboardMidShortcut
  }
  export interface ShrotCutRelatedData {
    id: number
    name: string
    date: any
    status:any
  }
  export interface LeapDashboardMidShortcut {
    id: number
    created_at: string
    updated_at: string
    bg_color_code: string
    shortcut_name: string
    shortcut_icon_url: string
    navigation_url: string
  }

  


 export interface ShortCutOne {
    selected_shortcut_id: number
    shortcut_id: number
    is_active: boolean
    created_at: any
    updated_at: string
    client_id: number
    leap_dashboard_shortcuts: LeapDashboardShortcuts
  }
  export interface LeapDashboardShortcuts {
    icon: string
    title: string
    page_url: string
    sub_title: string
    color_code: any
    created_at: any
    updated_at: string
    shortcut_id: number
  }
  