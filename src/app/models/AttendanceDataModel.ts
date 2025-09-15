
  
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
    date_of_joining: string
    employment_status: boolean
    device_id: string
    salary_structure: string
    user_role: number
    profile_pic: string
    emergency_contact: any
    contact_name: string
    relation: number
    manager_id: number
    designation_id: number
    authUuid: string
    branch_id: number
    emp_id: string
    updated_at: string
    marital_status: string
    nationality: string
    blood_group: string
    department_id: number
    employment_type: number
    work_location: string
    probation_period: any
    official_onboard_date: any
    alternateContact: any
    personalEmail: string
    work_mode: number
    user_role_id: any
    leap_customer_attendance: LeapCustomerAttendanceAPI[]
    leap_client_designations: LeapDesignation
    leap_client_departments: LeapDepartment
    showAttendanceData:boolean
  }
  
  export interface LeapCustomerAttendanceAPI {
    date: string
    remark: any
    in_time: string
    out_time: string
    client_id: number
    if_paused: boolean
    created_at: any
    updated_at: string
    approved_by: any
    customer_id: number
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
    leap_working_type: LeapWorkingType
    leap_customer_attendance_geolocation: LeapCustomerAttendanceGeolocation[]
  }
  
  export interface LeapCustomerAttendanceGeolocation {
    id: number
    is_paused: boolean
    created_at: string
    updated_at: string
    attendance_id: number
    stop_location: StopLocation
    pause_location: PauseLocation[]
    start_location: StartLocation[]
    resume_location: ResumeLocation[]
    total_working_hours: number
  }

  export interface LeapWorkingType {
    id: number
    type: string
    created_at: string
  }
  
  export interface StopLocation {
    crs: Crs
    type: string
    coordinates: number[]
  }
  
  export interface Crs {
    type: string
    properties: Properties
  }
  
  export interface Properties {
    name: string
  }
  
  export interface PauseLocation {
    crs: Crs2
    type: string
    coordinates: number[]
  }
  
  export interface Crs2 {
    type: string
    properties: Properties2
  }
  
  export interface Properties2 {
    name: string
  }
  
  export interface StartLocation {
    crs: Crs3
    type: string
    coordinates: number[]
  }
  
  export interface Crs3 {
    type: string
    properties: Properties3
  }
  
  export interface Properties3 {
    name: string
  }
  
  export interface ResumeLocation {
    crs: Crs4
    type: string
    coordinates: number[]
  }
  
  export interface Crs4 {
    type: string
    properties: Properties4
  }
  
  export interface Properties4 {
    name: string
  }
  
  export interface LeapDesignation {
    id: number
    designation_name: string
    is_active:string
  }
  
  export interface LeapDepartment {
    id: number
    is_active: boolean
    department_name: string
  }

export interface BreakTimingsArray{
  reason:string,
  pause_time:any,
  resume_time:any,

}  
  