

interface Project {
    project_id: string;
    project_name: string;
    leap_project_status?: { project_status_name: string }; // Ensure it's an object
  }
interface leave {
    id: any;
    from_date: any;
    leap_approval_status?: { approval_type: string }; // Ensure it's an object
    leap_customer?: { name: string }; // Ensure it's an object
  }
interface docs {
    id: any;
    leap_customer?: { name: string }; // Ensure it's an object
    leap_document_type?: { document_name: string }; // Ensure it's an object
  }


   interface ExportHolidaysParse {
    holiday_name: string
    date: string
    leap_holiday_types: ExportHolidaysLeapHolidayTypesParse
    leap_client_branch_details: ExportHolidaysLeapClientBranchDetailsParse
  }
  
   interface ExportHolidaysLeapHolidayTypesParse {
    holiday_type: string
  }
  
   interface ExportHolidaysLeapClientBranchDetailsParse {
    id: number
    branch_number: string
  }  


  interface ExportBirthdays {
    ocassion: string
    ocassion_date: string
    leap_customer: ExportBirthdaysLeapCustomer
  }
  interface ExportBirthdaysLeapCustomer {
    name: string
    emp_id: string
  }

  interface OCRDataExtractedValues {
    component_name: string
    value: string
  }
  interface EmployeePermissionDataSetting {
    emp_permission_id:any,
    permission_name:any,
    isAllowed:any

  }

  interface BankComponentsAddEditForm {
    branch_id:any,
    component_id:any
    componentName: any,
    componentDataType: any,
}

interface OCRUploadDataModel {
  document_extracted_id: any,
  document_name: string,
  document_url: string
  file:File|null
}