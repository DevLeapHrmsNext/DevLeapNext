
  
 interface TaskListResponseModel {
  name: string
  emp_id: string
  customer_id: number
  leap_customer_project_task: TaskListArray[]
  leap_client_departments?: DepartmentNameDataModel
  leap_client_designations?: DesignationNameDataModel
  leap_client_branch_details: BranchNameDataModel
}
  
 interface TaskListResponseModelCustomer {
    name: string
    emp_id: string
    customer_id: number
    leap_client_departments: LeapDepartment
    leap_client_designations: LeapDesignation
    leap_client_branch_details: BranchNameDataModel
  }
  
 interface LeapDepartment {
    department_name: string
  }
  
 interface LeapDesignation {
    designation_name: string
  }
  
 interface BranchNameDataModel {
    branch_number: string
    leap_client_working_hour_policy: LeapClientWorkingHourPolicy

  }
  interface LeapClientWorkingHourPolicy {
    full_day: number
    half_day: number
  }
  
 interface TaskListArray {
  id: number
  branch_id: number
  client_id: number
  task_date: string
  created_at: string
  project_id: number
  updated_at: string
  customer_id: number
  task_status: number
  total_hours: number
  task_details: string
  task_type_id: number
  total_minutes: number
  sub_project_id: number
  task_start_time: any
  leap_task_status: LeapTaskStatus
  leap_client_project: LeapClientProject
  leap_project_task_types: LeapProjectTaskTypes
  leap_client_sub_projects: LeapClientSubProjects
  }

   interface LeapTaskStatus {
  id: number
  status: string
  created_at: string
}

 interface LeapClientProject {
  branch_id: number
  client_id: number
  created_at: string
  is_deleted: boolean
  project_id: number
  updated_at: string
  project_logo: any
  project_name: string
  team_lead_id: number
  project_client: string
  project_status: number
  project_type_id: number
  project_color_code: any
  project_manager_id: number
}

 interface LeapProjectTaskTypes {
  branch_id: number
  client_id: number
  created_at: string
  updated_at: string
  task_type_id: number
  task_type_name: string
}

 interface LeapClientSubProjects {
  end_date: string
  branch_id: number
  client_id: number
  update_at: string
  created_at: string
  is_deleted: boolean
  project_id: number
  start_date: string
  tech_stacks: number[]
  department_id: number
  subproject_id: number
  project_details: any
  project_type_id: number
  sub_project_name: string
  project_manager_id: number
  sub_project_status: number
  completion_percentage: any
}
  
 interface LeapCustomer {
    name: string
    emp_id: string
    customer_id: number
    leap_client_departments: DepartmentNameDataModel
    leap_client_designations: DesignationNameDataModel
    leap_client_branch_details: BranchNameDataModel
  }
  
 interface DepartmentNameDataModel {
    department_name: string
  }
  
 interface DesignationNameDataModel {
    designation_name: string
  }
  
 interface BranchNameDataModel {
    branch_number: string
  }

  interface ProjectTaskDataResponseModel{
    
      id: number
      created_at: string
      customer_id: number
      client_id: number
      project_id: number
      task_type_id: number
      total_hours: number
      total_minutes: number
      task_details: string
      task_date: string
      updated_at: string
      sub_project_id: number
      task_status: number
      task_start_time: any
      branch_id: number
      leap_customer: LeapCustomer
      leap_client_project: LeapClientProject
      leap_client_sub_projects: LeapClientSubProjects
      leap_task_status: LeapTaskStatus
      leap_project_task_types: LeapProjectTaskTypes
    
  }

  