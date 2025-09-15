export interface CompanyModel {
    status: number
    message: string
    clients: Client[]
  }

  export interface Client {
    client_id: number
    created_at: string
    company_name: string
    number_of_branches: string
    sector_type: string
    company_location: string
    company_number: string
    company_email: string
    fullday_working_hours: string
    halfday_working_hours: string
    total_weekend_days: string
    is_deleted: boolean
    company_website_url: string
    timezone_id: any
    is_a_parent: boolean
    user_id: string
    parent_id: any
    updated_at: string
    leap_client_branch_details: LeapClientBranchDetail
    leap_sector_type: LeapSectorType
    leap_client_basic_info: LeapClientBasicInfo[]
  }
  
  export interface LeapClientBranchDetail {
    id: number
    uuid: string
    client_id: number
    dept_name: any
    is_active: boolean
    created_at: string
    updated_at: string
    branch_city: string
    branch_email: string
    time_zone_id: any
    branch_number: string
    branch_address: string
    is_main_branch: boolean
    contact_details: string
    total_employees: string
  }
  
  export interface LeapSectorType {
    id: number
    sector_type: string
  }

  export interface LeapClientBasicInfo {
    client_id: number
    created_at: string
    updated_at: string
    company_logo: string
    company_name: string
    primary_color: string
    compnay_websit: string
    secondary_color: string
    company_short_name: string
    client_basic_detail_id: number
  }
  