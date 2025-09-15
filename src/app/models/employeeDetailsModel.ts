export interface AddressModel {
  message: string
  status: number
  data: Address[]
}

export interface Address {
  customerAddress: CustomerAddress[]
  emergencyContact: EmergencyContact[]
}

export interface CustomerAddress {
  id: number
  client_id: number
  branch_id: number
  customer_id: number
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
  latitude: any
  longitude: any
  is_primary: boolean
  created_at: any
  updated_at: string
  address_type: string
}

export interface EmergencyContact {
  emergency_contact: string
  contact_name: string
  relation: string
  leap_relations: LeapRelations
}
export interface EmergencyContactNew {
  emergency_contact: string
  contact_name: string
  relation: LeapRelations
 
}

export interface LeapRelations {
  id: number
  relation_type: string
}


export interface BankModel {
  message: string
  status: number
  data: Bank[]
}

export interface Bank {
  bankDetails: BankDetail[]
  salaryDetails: SalaryDetail[]
  totalSalary: TotalSalary[]
}

export interface BankDetail {
  id: number
  created_at: string
  customer_id: number
  client_id: number
  bank_name: string
  account_number: string
  IFSC_code: string
  UAN_number: string
  ESIC_number: string
  PAN_number: string
  updated_at: string
  TIN_number: any
  security_insurance_no: any
  branch_name: any
}
export interface TotalSalary {
  id: number
  gross_salary: any
  total_deduction: any
  net_pay: any

  customer_id: number
}

export interface SalaryDetail {
  id: number
  client_id: number
  branch_id: number
  customer_id: number
  salary_component_id: number
  amount: string
  
  leap_client_salary_components: LeapClientSalaryComponents
}

export interface LeapClientSalaryComponents {
  client_Salary_compionent_id:number,
  salary_component_id: number
  leap_salary_components: LeapSalaryComponents
}

export interface LeapSalaryComponents {
  id: number
  salary_component_name: string
  salary_add:boolean
}

export interface ProfileModel {
  message: string
  status: number
  customer_profile: CustomerProfile[]
}

export interface CustomerProfile {
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
  profile_pic: any
  emergency_contact: number
  contact_name: string
  relation: number
  manager_id: number
  designation_id: number
  authUuid: any
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
  leap_client_branch_details: LeapClientBranchDetails
  leap_client: LeapClient
  leap_client_designations: LeapDesignation
  leap_client_departments: LeapDepartment
  leap_working_type: LeapWorkingType
  leap_employement_type: LeapEmployementType
}

export interface LeapClientBranchDetails {
  id: number
  uuid: string
  client_id: number
  dept_name: string
  is_active: boolean
  created_at: string
  updated_at: string
  branch_city: string
  branch_email: string
  time_zone_id: any
  branch_number: string
  branch_address: string
  is_main_branch: boolean
  contact_details: number
  total_employees: number
}

export interface LeapClient {
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
}

export interface LeapDesignation {
  id: number
  department: any
  designation_name: string
}

export interface LeapDepartment {
  id: number
  is_active: boolean
  department_name: string
}

export interface LeapWorkingType {
  id: number
  type: string
  created_at: string
}

export interface LeapEmployementType {
  created_at: string
  updated_at: string
  employeement_type: string
  employment_type_id: number
}
export interface CustomerProfileNew {
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
  device_id: any
  salary_structure: any
  user_role: number
  profile_pic: string
  emergency_contact: any
  contact_name: any
  relation: any
  
  authUuid: string
  branch_id: number
  emp_id: string
  updated_at: string
  marital_status: string
  nationality: string
  blood_group: string
  
  work_location: string
  probation_period: string
  official_onboard_date: string
  alternateContact: any
  personalEmail: string
  
  auth_token: any
  manager_id: ManagerId
  designation_id: DesignationId
  department_id: DepartmentId
  employment_type: EmploymentTypeNew
  work_mode: WorkMode
  leap_client_branch_details: LeapClientBranchDetails
  leap_client: LeapClient
}

export interface ManagerId {
  name: string
  customer_id: number
}

export interface DesignationId {
  designation_id: number
  designation_name: string
}

export interface WorkMode {
  id: number
  type: string
}
export interface DepartmentId {
  department_id: number
  department_name: string
}

export interface EmploymentTypeNew {
  employeement_type: string
  employment_type_id: number
}


export interface BankDetailNew {
  bank_account_count_id: number
  details: Detail[]
}
export interface Detail {
  pk_row_id: number
  data_type: number
  row_value: string
  component_name: string
  component_id: number
}

export interface BankComponentIdNew {
  id: number
  component_name: string
}

export interface TotalSalaryNew {
  id: number
  gross_salary: number
  total_deduction: number
  net_pay: number
  created_at: string
  updated_at: string
  customer_id: number
  pay_acural_days: number
}

