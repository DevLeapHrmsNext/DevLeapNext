interface DesignationTableModel {
  designation_id: number
    designation_name: string
    department: any
}
interface DepartmentTableModel {
  department_id: number
    department_name: string
    is_active: boolean
}
interface ClientBranchTableModel {
    client_id: number
    branch_address: string
    branch_city: string
    contact_details: number
    total_employees: number
    created_at: string
    branch_email: string
    branch_number: string
    is_active: boolean
    time_zone_id: any
    is_main_branch: boolean
    id: number
    uuid: string
    dept_name: any
    updated_at: string
}

interface ClientEmployementType {
    employment_type_id: number
    employeement_type: string
    created_at: string
    updated_at: string
}
interface RoleManagerNameModel {
    customer_id: number
    emp_id: string
    name: string
    client_id: number
    branch_id: number
}
interface SalaryPayableTypesModel {
    id: number
  payable_time: string
  created_at: string
  updated_at: any
}
interface SalaryComponentsModel {
    id: number
  client_id: number
  branch_id: number
  salary_component_id: number
  is_active: boolean
  created_at: string
  updated_at: any
  leap_salary_components: LeapSalaryComponents
}
interface LeapSalaryComponents {
    id: number
    created_at: string
    salary_add: boolean
    updated_at: string
    salary_component_name: string
    amount:any
  }

  interface LeapRelationComponents {
    id: number
    relation_type: string
    
  }  


  interface LeapUserActivitiesModel{
    id: number
  client_id: number
  branch_id: number
  customer_id: number
  activity_type_id: number
  designation_name: any
  department_name: any
  activity_details: string
  customer_image: any
  created_at: string
  updated_at: string
  customer_name: string
  activity_related_id:any
  activity_status:any
  leap_user_activity_type: LeapUserActivityType
  }

  interface LeapUserActivityType {
    id: number
    created_at: string
    updated_at: string
    activity_type: string
  }

  interface ClientBasicInfoModel{
    client_basic_detail_id: number
  client_id: number
  company_name: string
  company_logo: string
  company_short_name: string
  compnay_websit: string
  created_at: string
  updated_at: string
  }

 interface HolidayModel {
    status: number
    message: string
    data: HolidayObjectData
  }
  
 interface HolidayObjectData {
    totalHolidays: number
    holidays: Holiday[]
    upcomingHolidayID: UpcomingHolidayId[]
  }

  interface Holiday {
    id: number
    holiday_name: string
    holiday_type_id: number
    date: string
    client_id: number
    branch_id: number
    leap_holiday_types: LeapHolidayTypes
    leap_client_branch_details: BranchName
  }
  
  interface LeapHolidayTypes {
    id: number
    created_at: string
    updated_at: any
    holiday_type: string
  }
  interface BranchName {
    branch_number: string
  }
   interface UpcomingHolidayId {
    id: number
    holiday_name: string
    holiday_type_id: number
    date: string
    client_id: number
    branch_id: number
    leap_holiday_types: LeapHolidayTypes
  }

  interface AnnouncementType{
    announcement_type_id: number
  announcement_type: string
  created_at: string
  updated_at: string
  announcement_type_info: string
  }

  interface Roles{
  id: number
  created_at: string
  user_role: string
  }

  interface StatusModel {
    id: number
    created_at: string
    approval_type: string
  }
  interface SectorModel {
    id: number
    sector_type: string
  }


  interface AssetDetails {
    asset_id: number
    purchased_at: string
    asset_name: string
    asset_pic: string
    asset_status: number
    device_code: string
    created_at: string
    updated_at: string
    maintenance: string
    client_id: number
    branch_id: number
    is_deleted: boolean
    asset_type: number
    condition: number
    remark: string
    warranty_date: string
    configuration: string
    vendor_bill: any
  }
  interface AssetStatus {
    id: number
    created_at: string
    status: string
  }
  interface SupportRequestStatus {
    id: number
    created_at: string
    status: string
  }
  
  interface AssetTypeList {
    id: number
    created_at: string
    asset_type: string
  }

  interface AssetCondition {
    id: number
    created_at: string
    condition: string
  }

  interface leapMidShortCuts{
    id: number
    shortcut_name: string
    shortcut_icon_url: string
    created_at: string
    updated_at: string
    bg_color_code: string
  }

  interface TimeZoneModel {
    id: number
    time_zone: string
  }

  interface LeapBranchesNameID{
    id: number
    branch_number: string
  }

 

  interface ClientDesignationDataModel {
    designation_id: number
    client_id: number
    branch_id: number
    designation_name: string
    is_active: boolean
  }
  interface ClientDepartmentDataModel {
    department_id: number
    client_id: number
    branch_id: number
    department_name: string
    is_active: boolean
  }
  interface ClientBankComponentsDataModel {
    id: number
    client_id: number
    branch_id: number
    component_name: string
    data_type: number
  }

  interface ClientWorkingHoursDataModel {
    id: number
    created_at: string
    full_day: number
    half_day: number
    lunch_time: number
    client_id: number
    branch_id: number
    updated_at: string
    holiday_per_week: number
    role_id: number
    payable_type: number
  }


  interface SalaryComponentDataModel {
    id: number
    salary_component_name: string
    salary_add: boolean
    created_at: string
    updated_at: string
    is_basic_component?: boolean
    is_other_component_client_id?: number
  }

 //////////////////////////Ritika code merging models





interface TaskStatus {
  id: number
  status: string
  created_at: string
}
interface TaskType {
  task_type_id: number
  task_type_name: string
  client_id: number
  branch_id: string
  created_at: string
  updated_at: string
}

interface TaskPriority {
  id: number
  priority_type: string
  created_at: string
}


interface HolidayListYear {
  id: number
  list_name: string
  created_at: string
  description: string
  from_date: string
  to_date: string
  client_id: string
}

interface SupportPriority {
  id: number
  priority_name: string
  created_at: string
}
interface SupportStatus {
  id: number
  status: string
  created_at: string
}