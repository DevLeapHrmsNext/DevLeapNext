interface LeapClientDocuments{
    id: number
    client_id: number
    branch_id: number
    document_type_id: number
    document_url: any
    created_at: string
    updated_at: string
    from_date: any
    till_date: any
  }

  interface LeapCustomerDocuments{
    id: number
    client_id: number
    customer_id: number
    doc_type_id: number
    bucket_url: any
    isEnabled: boolean
    created_at: any
    updated_at: string
  }

  interface LeapDocumentType{
    id: number
    created_at: string
    document_name: string
    document_type_id: number
  }

  interface LeapEmployeeBasic{
    customer_id: number
    name: string
    emp_id: string
    branch_id: number
  }



  ///////// ritika code mergeing 

  interface LeapClientDocuments {
    id: number
    created_at: string
    document_name: string
    document_type_id: number
    leap_client_documents: LeapClientDocument[]
  }
  interface LeapClientDocument {
    id: number
    branch_id: number
    client_id: number
    from_date: any
    till_date: any
    created_at: string
    updated_at: string
    document_url: string
    document_type_id: number
    show_to_employees: boolean
  }

 interface OrganizationSpecific {
  id: number
  created_at: string
  document_name: string
  document_type_id: number
  leap_customer_documents: LeapCustomerDocument[]
}
  interface LeapCustomerDocument{
    id: number
    client_id: number
    customer_id: number
    doc_type_id: number
    bucket_url: any
    isEnabled: boolean
    created_at: any
    updated_at: string
  }

   interface EmployeePersonal {
    id: number
    created_at: string
    document_name: string
    document_type_id: number
    leap_customer_documents: LeapCustomerDocument2[]
  }
  
   interface LeapCustomerDocument2 {
    id: number
    client_id: number
    isEnabled: boolean
    bucket_url: string
    created_at?: string
    updated_at: string
    customer_id: number
    doc_type_id: number
  }
  
