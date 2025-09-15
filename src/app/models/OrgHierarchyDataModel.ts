export interface EmployeeORGHierarchyDataModel {
    id: string
    customer_id: number
    created_at: string
    name: string
    contact_number: string
    email_id: string
    dob: string
    client_id: number
    gender: string
    date_of_joining: any
    employment_status: boolean
    device_id: any
    salary_structure: any
    user_role: number
    profile_pic?: string
    emergency_contact: any
    contact_name: any
    relation: any
    manager_id: any
    designation_id: number
    authUuid?: string
    branch_id: number
    emp_id: string
    updated_at: string
    marital_status?: string
    nationality?: string
    blood_group?: string
    department_id: number
    employment_type: any
    work_location: any
    probation_period: any
    official_onboard_date: any
    alternateContact: any
    personalEmail: any
    work_mode: any
    auth_token: any
    leap_client_designations: ClientDesignationDataModel
    leap_client_departments: ClientDepartmentDataModel
    children: EmployeeORGHierarchyDataModel[]
    collapsed:any
    bg_color:any
    hasChildren:any
  }