interface LoginResponseModel{
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
    emergency_contact: number
    contact_name: string
    relation: number
    manager_id: any
    designation_id: number
    authUuid: string
    branch_id: number
    emp_id: string
    updated_at: string
    marital_status: any
    nationality: any
    blood_group: any
    department_id: number
    employment_type: any
    work_location: any
    probation_period: any
    official_onboard_date: any
    alternateContact: any
    personalEmail: any
    work_mode: any
    user_role_id: any
    leap_client: LeapClient
  }
  
interface LeapClient {
    user_id: string
    client_id: number
    parent_id: any
    created_at: string
    is_deleted: boolean
    updated_at: string
    is_a_parent: boolean
    sector_type: string
    timezone_id: any
    company_name: string
    company_email: string
    company_number: string
    company_location: string
    number_of_branches: number
    total_weekend_days: number
    company_website_url: string
    fullday_working_hours: number
    halfday_working_hours: number
    leap_client_branch_details: LeapClientBranchDetail[]
  }
  
interface LeapClientBranchDetail {
    id: number
    uuid: string
    client_id: number
    is_active: boolean
    created_at: string
    updated_at: string
    branch_city: string
    branch_email: string
    time_zone_id: number
    branch_number: string
    branch_address: string
    is_main_branch: boolean
    contact_details: number
    total_employees?: number
  }