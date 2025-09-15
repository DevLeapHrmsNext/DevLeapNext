export interface SupportModel {
  status: number
  message: string
  data: SupportList[]
}

export interface SupportList {
  id: number
  created_at: string
  client_id: number
  branch_id: number
  customer_id: number
  type_id: number
  description: string
  priority_level: number
  active_status: number
  raised_on: string
  ticket_id: string
  leap_request_master: LeapRequestMaster
  leap_request_priority: LeapRequestPriority
  leap_customer: LeapCustomer
  leap_request_status: LeapRequestStatus
}

export interface LeapRequestMaster {
  id: number
  category: string
  type_name: string
  created_at: string
}

export interface LeapRequestPriority {
  priority_name: string
}

export interface LeapCustomer {
  name: string
}

export interface LeapRequestStatus {
  status: string
}

export interface RaiseSupport {
  status: number
  message: string
  data: SupportForm[]
}

export interface SupportForm {
  id: number
  created_at: string
  client_id: string
  branch_id: string
  customer_id: string
  type_id: string
  description: string
  priority_level: string
  active_status: string
  updated_at: string
}

export interface SingleSupportModel {
  status: number
  message: string
  data: SingleSupportRequest[]
}
export interface SingleSupportRequest {
  id: number
  created_at: string
  client_id: number
  branch_id: number
  customer_id: number
  type_id: number
  description: string
  priority_level: number
  active_status: number
  updated_at: string
  raised_on: string
  comments: any
  ticket_id: string
  leap_request_master: LeapRequestMaster
  leap_request_priority: LeapRequestPriority
  leap_customer: LeapCustomer
  leap_request_status: LeapRequestStatus
  leap_client_employee_requests_updates: ClientEmployeeRequestsUpdates[]
}
export interface ClientEmployeeRequestsUpdates {
  request_updates_id: any,
  request_id: any,
  customer_id: any,
  status: any,
  comments: any,
  created_at: any,
  updated_at: any
  leap_customer: LeapCustomer
  leap_request_status: LeapRequestStatus

}