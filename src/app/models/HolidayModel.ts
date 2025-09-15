
export interface HolidayModel {
  status: number
  message: string
  data: Data
}

export interface Data {
  totalHolidays: number
  holidays: Holiday[]
}

export interface Holiday {
  id: number
  holiday_name: string
  holiday_type_id: string
  date: string
  client_id: string
  branch_id: string
  created_at: string
  updated_at: string
  holiday_year: string
  leap_holiday_types: LeapHolidayTypes
  leap_client_branch_details: LeapClientBranchDetails
  leap_holiday_year: LeapHolidayYear
}

export interface LeapHolidayTypes {
  id: string
  created_at: string
  updated_at: string
  holiday_type: string
}

export interface LeapClientBranchDetails {
  branch_id: string
  branch_number: string
}

export interface LeapHolidayYear {
  id: number
  to_date: string
  client_id: string
  from_date: string
  list_name: string
  created_at: string
  description: string
}