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
}

export interface BankDetail {
  id: number
  customer_id: number
  client_id: number
  bank_component_id: BankComponentId
  component_value: string
  created_at: string
  updated_at: any
  bank_account_count_id: number
}

export interface BankComponentId {
  component_name: string
  id: number
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
  profile_pic: string
  emergency_contact: any
  contact_name: any
  relation: any
  manager_id: ManagerId
  designation_id: DesignationId
  authUuid: string
  branch_id: number
  emp_id: string
  updated_at: string
  marital_status: string
  nationality: string
  blood_group: string
  department_id: DepartmentId
  employment_type: EmploymentType
  work_location: string
  probation_period: string
  official_onboard_date: string
  alternateContact: any
  personalEmail: string
  work_mode: WorkMode
  auth_token: string
  leap_client_branch_details: LeapClientBranchDetails
  leap_client: LeapClient
}

export interface ManagerId {
  name: string
}

export interface DesignationId {
  designation_name: string
}

export interface DepartmentId {
  department_name: string
}

export interface EmploymentType {
  employeement_type: string
}

export interface WorkMode {
  type: string
}

export interface LeapClientBranchDetails {
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
