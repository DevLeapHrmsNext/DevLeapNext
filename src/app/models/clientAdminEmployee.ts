export interface employeeResponse {
    status: number
    message: string
    data: Employee[]
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
    is_active: boolean
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
    marital_status: any
    nationality: any
    blood_group: any
    department_id: any
    employment_type: any
    work_location: any
    probation_period: any
    official_onboard_date: any
    leap_client_designations: LeapDesignation
    leap_client_departments: LeapDepartment
    leap_client_branch_details: LeapBranch
  }
  
  export interface LeapDesignation {
    designation_name: string
  }
  
  export interface LeapDepartment {
    department_name: string
  }

  export interface LeapBranch {
    branch_city: string
  }
  
