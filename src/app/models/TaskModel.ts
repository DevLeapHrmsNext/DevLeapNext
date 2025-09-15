export interface TaskModel {
    status: number
    message: string
    data: Task[]
  }
  
  export interface Task {
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
    approval_status: number
    leap_project_task_types: LeapProjectTaskTypes
    leap_customer: LeapCustomer
    leap_client_sub_projects: LeapClientSubProjects
    leap_task_status: LeapTaskStatus
    leap_approval_status: LeapApprovalStatus

  }
  
export interface LeapClientProject {
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

export interface LeapProjectTaskTypes {
  branch_id: number
  client_id: number
  created_at: string
  updated_at: string
  task_type_id: number
  task_type_name: string
}

export interface LeapCustomer {
  name: string
}

export interface LeapClientSubProjects {
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
  leap_client_project: LeapClientProject
}

export interface LeapTaskStatus {
  id: number
  status: string
  created_at: string
}

export interface LeapApprovalStatus {
  id: number
  created_at: string
  approval_type: string
}

  export interface ProjectModel {
    status: number
    message: string
    data: Project[]
  }
  
  export interface Project {
    project_id: number
    created_at: string
    client_id: number
    branch_id: number
    project_name: string
    project_client: string
    updated_at: string
    project_manager_id: number
    team_lead_id: number
    project_status: number
    leap_client_sub_projects: SubProject[]
  }
  
  export interface SubProject {
    end_date: string
    branch_id: number
    client_id: number
    update_at: string
    created_at: string
    project_id: number
    start_date: string
    department_id: number
    subproject_id: number
    sub_project_name: string
    project_manager_id: number
    sub_project_status: any
  }
  
  export interface AssignedTaskModel {
    status: number
    message: string
    data: AssignedTask[]
  }
  
  export interface AssignedTask {
    id: number
    created_at: string
    assigned_to: number
    task_priority: number
    project_id: number
    deadline: string
    assigned_by: number
    updated_at: string
    task_details: string
    task_status: number
    sub_project_id: number
    client_id: number
    task_date: string
    task_type_id: number
    leap_task_priority_level: LeapTaskPriorityLevel
    leap_task_status?: LeapTaskStatus
    leap_client_sub_projects: LeapClientSubProjects
    leap_project_task_types: LeapProjectTaskTypes
    leap_customer: LeapCustomer
  }
  
  export interface LeapTaskPriorityLevel {
    id: number
    created_at: string
    priority_type: string
  }
  
  export interface LeapClientProject {
    project_name: string
  }
  
  export interface LeapTaskStatus {
    id: number
    status: string
    created_at: string
  }
  
  export interface LeapClientSubProjects {
    sub_project_name: string
    leap_client_project: LeapClientProject

  }
  export interface LeapCustomer {
    name: string
  }
  export interface LeapProjectTaskTypes {
    task_type_name: string
  }
  


  // export interface Root {
  //   message: string
  //   status: number
  //   leavedata: Leavedaum[]
  // }
  
  // export interface Leavedaum {
  //   id: number
  //   created_at: string
  //   customer_id: number
  //   client_id: number
  //   project_id: number
  //   task_type_id: number
  //   total_hours: number
  //   total_minutes: number
  //   task_details: string
  //   task_date: string
  //   updated_at: string
  //   sub_project_id: number
  //   task_status: number
  //   task_start_time: any
  //   branch_id: number
  //   approval_status: number
  //   leap_client_project: LeapClientProject
  //   leap_project_task_types: LeapProjectTaskTypes
  //   leap_customer: LeapCustomer
  //   leap_client_sub_projects: LeapClientSubProjects
  //   leap_task_status: LeapTaskStatus
  //   leap_approval_status: LeapApprovalStatus
  // }
  
  // export interface LeapClientProject {
  //   branch_id: number
  //   client_id: number
  //   created_at: string
  //   is_deleted: boolean
  //   project_id: number
  //   updated_at: string
  //   project_logo: any
  //   project_name: string
  //   team_lead_id: number
  //   project_client: string
  //   project_status: number
  //   project_type_id: number
  //   project_color_code: any
  //   project_manager_id: number
  // }
  
  // export interface LeapProjectTaskTypes {
  //   branch_id: number
  //   client_id: number
  //   created_at: string
  //   updated_at: string
  //   task_type_id: number
  //   task_type_name: string
  // }
  
  // export interface LeapCustomer {
  //   name: string
  // }
  
  // export interface LeapClientSubProjects {
  //   end_date: string
  //   branch_id: number
  //   client_id: number
  //   update_at: string
  //   created_at: string
  //   is_deleted: boolean
  //   project_id: number
  //   start_date: string
  //   tech_stacks: number[]
  //   department_id: number
  //   subproject_id: number
  //   project_details: any
  //   project_type_id: number
  //   sub_project_name: string
  //   project_manager_id: number
  //   sub_project_status: number
  //   completion_percentage: any
  // }
  
  // export interface LeapTaskStatus {
  //   id: number
  //   status: string
  //   created_at: string
  // }
  
  // export interface LeapApprovalStatus {
  //   id: number
  //   created_at: string
  //   approval_type: string
  // }
  