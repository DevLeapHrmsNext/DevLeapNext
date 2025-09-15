interface ProjectStatusDataModel {
    project_status_id: number
    project_status_name: string
    color_codes:string
  }

   interface CompanyProjectsDataModel {
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
    project_logo: string
    project_color_code: string
    is_deleted: boolean
    project_type_id: any
    manager: Manager
    team_lead: TeamLead
    leap_client_sub_projects: CompanySubProjectsDataModel[]
    leap_project_status: ProjectStatusDataModel
    leap_client_branch_details: ClientBranchTableModel

  } 

  interface CompanySubProjectsDataModel {
    end_date: string
    branch_id: number
    client_id: number
    update_at: string
    created_at: string
    project_id: number
    start_date: string
    department_id: number
    subproject_id: number
    project_details: any
    sub_project_name: string
    project_manager_id: number
    sub_project_status: any
    manager: Manager,
    is_deleted:boolean
    leap_project_status: ProjectStatusDataModel
    leap_client_departments: LeapDepartment
  }

 interface Manager {
    name: string
  }
  
 interface TeamLead {
    name: string
  }

  interface LeapDepartment {
    department_name: string
  }

  interface LeapProjectTypeModel {
    id: number
    project_type: string
    
  }

  interface LeapProjectTechStacksModel {
    id: number
    tech_name: string
  
  }

  interface CustomerNameEmpIDCustIDModel {
    name: string
    emp_id: string
    customer_id: number
  }

  interface ProjectStatusDataModel {
    project_status_id: number
    project_status_name: string
    color_codes: string
  }

  interface CompanySingleProjectModel {
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
    project_logo: any
    project_color_code: any
    is_deleted: boolean,
    project_type_id: number
    leap_client_sub_projects:CompanySingleSubProjectModel[]

  }

  interface CompanySingleSubProjectModel {
    subproject_id: number
    project_id: number
    client_id: number
    branch_id: number
    sub_project_name: string
    start_date: string
    end_date: string
    project_manager_id: number
    department_id: number
    created_at: string
    update_at: string
    sub_project_status: any
    project_details: any
    tech_stacks: number[]
    completion_percentage: any
    is_deleted: boolean
    project_type_id: number
  }