
export interface DashboardGreetingModel {
    status: number
    message: string
    data: DashboardGreeting[]
  }
  
export interface DashboardGreeting {
    id: string
    created_at: string
    greeting_topic: string
    greeting_msg: string
    img_url: any
  }

  export interface AttendanceTimer {
     date: string
    remark: any
    in_time: string
    out_time: string
    client_id: string
    if_paused: boolean
    created_at: any
    updated_at: string
    approved_by: any
    customer_id: string
    total_hours: number
    attendance_id: number
    img_attachment: string
    pause_end_time: string[]
    approval_status: any
    paused_duration: string
    working_type_id: any
    attendanceStatus: number
    pause_start_time: string[]
    paused_reasons: string[]
    leap_working_type: WorkingTypeid
  }

  export interface WorkingTypeid{
    id: number
    created_at: any
    type: string
  }

  export interface TeamMembersModel {
  status: number
  message: string
  data: TeamDetails
}
export interface TeamDetails {
  manager: ManagerData
  teamMembers: TeamMember[]
  subordinates: Subordinate[]
}
export interface ManagerData {
  name: string
  contact_number: string
  email_id: string
  profile_pic: any
  designation_id: number
  leap_client_designations: LeapClientDesignations
}

export interface LeapClientDesignations {
  designation_name: string
}

export interface TeamMember {
  name: string
  contact_number: string
  email_id: string
  profile_pic: any
  designation_id: number
  leap_client_designations: LeapClientDesignations2
}

export interface LeapClientDesignations2 {
  designation_name: string
}

export interface Subordinate {
  name: string
  contact_number: string
  email_id: string
  profile_pic?: string
  designation_id: number
  leap_client_designations: LeapClientDesignations3
}

export interface LeapClientDesignations3 {
  designation_name: string
}

export interface Root {
  message: string
  status: number
   workingHour: WorkingHour
  employees: Employees
  leaveRequest: LeaveRequest
  upcommingHolidays: UpcommingHolidays
  myattendance: Myattendance[]
  my_leave_requests: MyLeaveRequests
  myLeaveBalances: MyLeaveBalances
  announcements: Announcement[]
  my_tasks: MyTask[]
  my_name: MyName
  birthdays: Birthday[]
  notification: UserNotification[]
}
export interface WorkingHour {
  workData: WorkDaum[]
}
export interface WorkDaum {
  full_day: number
}
export interface Employees {}

export interface LeaveRequest {
  totalRequest: number
  employees: Employee[]
}

export interface Employee {
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
  approve_disapprove_remark?: string
  attachments?: string
  branch_id: number
  updated_at: string
  isAssigned: boolean
  duration: string
  leap_customer?: LeapCustomer
}

export interface LeapCustomer {
  customer_id: number
}

export interface UpcommingHolidays {
  holidays: Holiday[]
}

export interface Holiday {
  id: number
  holiday_name: string
  holiday_type_id: number
  date: string
  client_id: number
  branch_id: number
  created_at: string
  updated_at: string
  holiday_year: number
  holiday_image: any
}

export interface Myattendance {
  attendance_id: number
  date: string
  customer_id: number
  client_id: number
  in_time: string
  out_time: any
  working_type_id: number
  total_hours: any
  if_paused: boolean
  remark: any
  approval_status: any
  approved_by: any
  paused_duration: any
  img_attachment: string
  pause_start_time: any
  pause_end_time: any
  updated_at: string
  created_at: string
  attendanceStatus: number
  paused_reasons: any
  leap_working_type: LeapWorkingType
}

export interface LeapWorkingType {
  type: string
}

export interface MyLeaveRequests {
  totalRequest: number
  employees: Employee2[]
}

export interface Employee2 {
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
}

export interface MyLeaveBalances {
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

export interface Announcement {
  branch_id: number
  client_id: number
  isDeleted: boolean
  isEnabled: boolean
  created_at: string
  updated_at: string
  num_of_days?: number
  send_to_all: boolean
  send_on_date: string
  validity_date: string
  announcement_id: number
  announcement_date: string
  announcement_image: string
  announcement_title: string
  announcement_details: string
  announcement_type_id: number
}

export interface MyTask {
  task_details: string
  sub_project_id: SubProjectId
  task_type_id: TaskTypeId
  task_status: TaskStatus
  type: string
}

export interface SubProjectId {
  sub_project_name: string
}

export interface TaskTypeId {
  task_type_name: string
}

export interface TaskStatus {
  id: number
  status: string
}

export interface MyName {
  firstName: string
}

export interface Birthday {
  ocassion: string
  ocassion_date: string
  leap_customer: LeapCustomer2
}

export interface LeapCustomer2 {
  name: string
}

export interface UserNotification {
  id: number
  client_id: number
  branch_id: any
  customer_id: number
  activity_type_id: number
  designation_name: string
  department_name: string
  activity_details: string
  customer_image: string
  created_at: string
  updated_at: string
  customer_name: string
  activity_related_id: number
  activity_status: number
  user_notify: boolean
  leap_user_activity_type: LeapUserActivityType
  type: string
}

export interface LeapUserActivityType {
  id: number
  created_at: string
  is_deleted: boolean
  updated_at: string
  activity_type: string
}