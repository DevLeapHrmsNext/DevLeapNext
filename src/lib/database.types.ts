export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      leap_alert_message: {
        Row: {
          created_at: string
          id: number
          message: string | null
          message_type: string | null
          status_code: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string | null
          message_type?: string | null
          status_code?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string | null
          message_type?: string | null
          status_code?: string | null
        }
        Relationships: []
      }
      leap_all_birthdays: {
        Row: {
          client_id: number | null
          created_at: string
          customer_id: number | null
          id: number
          is_enabled: boolean | null
          ocassion: string | null
          ocassion_date: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          is_enabled?: boolean | null
          ocassion?: string | null
          ocassion_date?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          is_enabled?: boolean | null
          ocassion?: string | null
          ocassion_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_all_birthdays_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_all_birthdays_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_all_birthdays_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_all_modules: {
        Row: {
          created_at: string | null
          id: number
          module_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          module_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          module_name?: string | null
        }
        Relationships: []
      }
      leap_app_version: {
        Row: {
          app_link: string | null
          app_name: string | null
          app_version: number | null
          created_at: string
          force_update: boolean | null
          id: number
          platform: string | null
        }
        Insert: {
          app_link?: string | null
          app_name?: string | null
          app_version?: number | null
          created_at?: string
          force_update?: boolean | null
          id?: number
          platform?: string | null
        }
        Update: {
          app_link?: string | null
          app_name?: string | null
          app_version?: number | null
          created_at?: string
          force_update?: boolean | null
          id?: number
          platform?: string | null
        }
        Relationships: []
      }
      leap_approval_status: {
        Row: {
          approval_type: string
          created_at: string
          id: number
        }
        Insert: {
          approval_type: string
          created_at?: string
          id?: number
        }
        Update: {
          approval_type?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      leap_branch_weekends: {
        Row: {
          branch_id: number
          client_id: number
          created_at: string
          day_end: string | null
          day_start: string | null
          id: number
          is_deleted: boolean | null
          weekend_days: string | null
        }
        Insert: {
          branch_id: number
          client_id: number
          created_at?: string
          day_end?: string | null
          day_start?: string | null
          id?: number
          is_deleted?: boolean | null
          weekend_days?: string | null
        }
        Update: {
          branch_id?: number
          client_id?: number
          created_at?: string
          day_end?: string | null
          day_start?: string | null
          id?: number
          is_deleted?: boolean | null
          weekend_days?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_branch_weekends_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_city: {
        Row: {
          city: string | null
          id: number
          state: string | null
        }
        Insert: {
          city?: string | null
          id?: number
          state?: string | null
        }
        Update: {
          city?: string | null
          id?: number
          state?: string | null
        }
        Relationships: []
      }
      leap_client: {
        Row: {
          client_id: number
          company_email: string
          company_location: string | null
          company_name: string
          company_number: string
          company_website_url: string
          created_at: string
          fullday_working_hours: number | null
          halfday_working_hours: number | null
          is_a_parent: boolean
          is_deleted: boolean
          number_of_branches: number | null
          parent_id: number | null
          sector_type: string | null
          timezone_id: number | null
          total_weekend_days: number | null
          user_id: string | null
        }
        Insert: {
          client_id?: number
          company_email: string
          company_location?: string | null
          company_name: string
          company_number: string
          company_website_url: string
          created_at?: string
          fullday_working_hours?: number | null
          halfday_working_hours?: number | null
          is_a_parent?: boolean
          is_deleted?: boolean
          number_of_branches?: number | null
          parent_id?: number | null
          sector_type?: string | null
          timezone_id?: number | null
          total_weekend_days?: number | null
          user_id?: string | null
        }
        Update: {
          client_id?: number
          company_email?: string
          company_location?: string | null
          company_name?: string
          company_number?: string
          company_website_url?: string
          created_at?: string
          fullday_working_hours?: number | null
          halfday_working_hours?: number | null
          is_a_parent?: boolean
          is_deleted?: boolean
          number_of_branches?: number | null
          parent_id?: number | null
          sector_type?: string | null
          timezone_id?: number | null
          total_weekend_days?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_sector_type_fkey"
            columns: ["sector_type"]
            isOneToOne: false
            referencedRelation: "leap_sector_type"
            referencedColumns: ["sector_type"]
          },
        ]
      }
      leap_client_branch_details: {
        Row: {
          branch_address: string | null
          branch_city: string
          branch_email: string
          branch_number: string | null
          client_id: number
          contact_details: number
          created_at: string | null
          dept_name: string | null
          id: number
          is_active: boolean
          is_main_branch: boolean | null
          time_zone_id: number | null
          total_employees: number | null
          uuid: string
        }
        Insert: {
          branch_address?: string | null
          branch_city: string
          branch_email: string
          branch_number?: string | null
          client_id: number
          contact_details: number
          created_at?: string | null
          dept_name?: string | null
          id?: number
          is_active?: boolean
          is_main_branch?: boolean | null
          time_zone_id?: number | null
          total_employees?: number | null
          uuid?: string
        }
        Update: {
          branch_address?: string | null
          branch_city?: string
          branch_email?: string
          branch_number?: string | null
          client_id?: number
          contact_details?: number
          created_at?: string | null
          dept_name?: string | null
          id?: number
          is_active?: boolean
          is_main_branch?: boolean | null
          time_zone_id?: number | null
          total_employees?: number | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_details_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_details_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_branch_details_time_zone_id_fkey"
            columns: ["time_zone_id"]
            isOneToOne: false
            referencedRelation: "leap_time_zone"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_geolocation: {
        Row: {
          client_id: number | null
          id: number
          latitude: string
          longitude: string
          office_id: number | null
        }
        Insert: {
          client_id?: number | null
          id?: number
          latitude: string
          longitude: string
          office_id?: number | null
        }
        Update: {
          client_id?: number | null
          id?: number
          latitude?: string
          longitude?: string
          office_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_geolocation_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_geolocation_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_client_is_active: {
        Row: {
          client_id: number | null
          id: number
          is_active: boolean | null
          joining_date: string | null
          last_date: string | null
        }
        Insert: {
          client_id?: number | null
          id?: number
          is_active?: boolean | null
          joining_date?: string | null
          last_date?: string | null
        }
        Update: {
          client_id?: number | null
          id?: number
          is_active?: boolean | null
          joining_date?: string | null
          last_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_is_active_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_is_active_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_client_permission: {
        Row: {
          allow_delete_access: boolean | null
          allow_insert_access: boolean | null
          allow_read_access: boolean | null
          allow_update_access: boolean | null
          client_id: number | null
          created_at: string
          id: number
          permission_type_id: number | null
          updated_at: string | null
        }
        Insert: {
          allow_delete_access?: boolean | null
          allow_insert_access?: boolean | null
          allow_read_access?: boolean | null
          allow_update_access?: boolean | null
          client_id?: number | null
          created_at?: string
          id?: number
          permission_type_id?: number | null
          updated_at?: string | null
        }
        Update: {
          allow_delete_access?: boolean | null
          allow_insert_access?: boolean | null
          allow_read_access?: boolean | null
          allow_update_access?: boolean | null
          client_id?: number | null
          created_at?: string
          id?: number
          permission_type_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_permission_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_permission_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_permission_permission_type_id_fkey"
            columns: ["permission_type_id"]
            isOneToOne: false
            referencedRelation: "leap_permission_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_policy: {
        Row: {
          client_id: number | null
          created_at: string
          end_date: string | null
          end_financial_year: string | null
          end_month: string | null
          financial_year: string | null
          id: number
          is_carry_forward: boolean | null
          is_deleted: boolean | null
          opening_balance: string | null
          start_date: string | null
          start_month: string | null
          year: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          end_date?: string | null
          end_financial_year?: string | null
          end_month?: string | null
          financial_year?: string | null
          id?: number
          is_carry_forward?: boolean | null
          is_deleted?: boolean | null
          opening_balance?: string | null
          start_date?: string | null
          start_month?: string | null
          year?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          end_date?: string | null
          end_financial_year?: string | null
          end_month?: string | null
          financial_year?: string | null
          id?: number
          is_carry_forward?: boolean | null
          is_deleted?: boolean | null
          opening_balance?: string | null
          start_date?: string | null
          start_month?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_policy_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_policy_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_client_working_hour_policy: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string
          full_day: number | null
          half_day: number | null
          id: number
          lunch_time: number | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          full_day?: number | null
          half_day?: number | null
          id?: number
          lunch_time?: number | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          full_day?: number | null
          half_day?: number | null
          id?: number
          lunch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_working_hour_policy_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_working_hour_policy_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_working_hour_policy_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_country: {
        Row: {
          currency: string
          id: number
          name: string
        }
        Insert: {
          currency: string
          id?: number
          name: string
        }
        Update: {
          currency?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      leap_credentails: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean | null
          password: string | null
          user_id: number | null
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          password?: string | null
          user_id?: number | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          password?: string | null
          user_id?: number | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_credentails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_cust_document_types: {
        Row: {
          created_at: string
          document_id: number | null
          id: number
        }
        Insert: {
          created_at?: string
          document_id?: number | null
          id?: number
        }
        Update: {
          created_at?: string
          document_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "leap_cust_document_types_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "leap_document_type"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_customer: {
        Row: {
          address: string | null
          authUuid: string | null
          branch_id: number | null
          client_id: number
          contact_name: string | null
          contact_number: string | null
          created_at: string
          customer_id: number
          date_of_joining: string | null
          designation_id: number | null
          device_id: number | null
          dob: string | null
          email_id: string
          emergency_contact: number | null
          gender: string | null
          id: string
          is_active: boolean
          manager_id: number | null
          name: string
          profile_pic: Json | null
          relation: number | null
          salary_structure: string | null
          user_role: number | null
        }
        Insert: {
          address?: string | null
          authUuid?: string | null
          branch_id?: number | null
          client_id: number
          contact_name?: string | null
          contact_number?: string | null
          created_at?: string
          customer_id?: number
          date_of_joining?: string | null
          designation_id?: number | null
          device_id?: number | null
          dob?: string | null
          email_id: string
          emergency_contact?: number | null
          gender?: string | null
          id?: string
          is_active?: boolean
          manager_id?: number | null
          name: string
          profile_pic?: Json | null
          relation?: number | null
          salary_structure?: string | null
          user_role?: number | null
        }
        Update: {
          address?: string | null
          authUuid?: string | null
          branch_id?: number | null
          client_id?: number
          contact_name?: string | null
          contact_number?: string | null
          created_at?: string
          customer_id?: number
          date_of_joining?: string | null
          designation_id?: number | null
          device_id?: number | null
          dob?: string | null
          email_id?: string
          emergency_contact?: number | null
          gender?: string | null
          id?: string
          is_active?: boolean
          manager_id?: number | null
          name?: string
          profile_pic?: Json | null
          relation?: number | null
          salary_structure?: string | null
          user_role?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_designation_id_fkey"
            columns: ["designation_id"]
            isOneToOne: false
            referencedRelation: "leap_client_designations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_customer_relation_fkey"
            columns: ["relation"]
            isOneToOne: false
            referencedRelation: "leap_relations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_salary_structure_fkey"
            columns: ["salary_structure"]
            isOneToOne: false
            referencedRelation: "leap_salary_structure"
            referencedColumns: ["index"]
          },
          {
            foreignKeyName: "leap_customer_user_role_fkey"
            columns: ["user_role"]
            isOneToOne: false
            referencedRelation: "leap_user_role"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_customer_apply_leave: {
        Row: {
          approve_disapprove_remark: string | null
          approved_by_id: number | null
          attachments: string | null
          branch_id: number | null
          client_id: number | null
          created_at: string
          customer_id: number | null
          from_date: string | null
          id: number
          leave_reason: string | null
          leave_status: number | null
          leave_type: number | null
          to_date: string | null
          total_days: number | null
          updated_at: string | null
        }
        Insert: {
          approve_disapprove_remark?: string | null
          approved_by_id?: number | null
          attachments?: string | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          from_date?: string | null
          id?: number
          leave_reason?: string | null
          leave_status?: number | null
          leave_type?: number | null
          to_date?: string | null
          total_days?: number | null
          updated_at?: string | null
        }
        Update: {
          approve_disapprove_remark?: string | null
          approved_by_id?: number | null
          attachments?: string | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          from_date?: string | null
          id?: number
          leave_reason?: string | null
          leave_status?: number | null
          leave_type?: number | null
          to_date?: string | null
          total_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_leave_approved_by_id_fkey"
            columns: ["approved_by_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_customer_leave_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_leave_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_leave_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_leave_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_customer_leave_leave_status_fkey"
            columns: ["leave_status"]
            isOneToOne: false
            referencedRelation: "leap_approval_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_leave_leave_type_fkey"
            columns: ["leave_type"]
            isOneToOne: false
            referencedRelation: "leap_leave_type"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_customer_attendance: {
        Row: {
          approval_status: number | null
          approved_by: number | null
          attendance_id: number
          client_id: number | null
          customer_id: number | null
          date: string
          if_paused: boolean | null
          img_attachment: string | null
          in_time: string | null
          out_time: string | null
          pause_end_time: string[] | null
          pause_start_time: string[] | null
          paused_duration: number | null
          remark: string | null
          total_hours: number | null
          working_type_id: number | null
        }
        Insert: {
          approval_status?: number | null
          approved_by?: number | null
          attendance_id?: number
          client_id?: number | null
          customer_id?: number | null
          date: string
          if_paused?: boolean | null
          img_attachment?: string | null
          in_time?: string | null
          out_time?: string | null
          pause_end_time?: string[] | null
          pause_start_time?: string[] | null
          paused_duration?: number | null
          remark?: string | null
          total_hours?: number | null
          working_type_id?: number | null
        }
        Update: {
          approval_status?: number | null
          approved_by?: number | null
          attendance_id?: number
          client_id?: number | null
          customer_id?: number | null
          date?: string
          if_paused?: boolean | null
          img_attachment?: string | null
          in_time?: string | null
          out_time?: string | null
          pause_end_time?: string[] | null
          pause_start_time?: string[] | null
          paused_duration?: number | null
          remark?: string | null
          total_hours?: number | null
          working_type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_attendance_approval_status_fkey"
            columns: ["approval_status"]
            isOneToOne: false
            referencedRelation: "leap_approval_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_attendance_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_customer_attendance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_attendance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_attendance_employee_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_customer_attendance_working_type_id_fkey"
            columns: ["working_type_id"]
            isOneToOne: false
            referencedRelation: "leap_working_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_attendance_working_type_id_fkey1"
            columns: ["working_type_id"]
            isOneToOne: false
            referencedRelation: "leap_working_type"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_customer_attendance_geolocation: {
        Row: {
          attendance_id: number | null
          created_at: string
          first_half_working_time: number | null
          id: number
          is_paused: boolean | null
          is_resumed: boolean | null
          paused_duration: number | null
          paused_latitude: string | null
          paused_longitude: string | null
          resume_latitude: string | null
          resume_longitude: string | null
          second_half_working_time: number | null
          start_latitude: string | null
          start_longitude: string | null
          stop_latitude: string | null
          stop_longitude: string | null
          total_working_hours: number | null
        }
        Insert: {
          attendance_id?: number | null
          created_at?: string
          first_half_working_time?: number | null
          id?: number
          is_paused?: boolean | null
          is_resumed?: boolean | null
          paused_duration?: number | null
          paused_latitude?: string | null
          paused_longitude?: string | null
          resume_latitude?: string | null
          resume_longitude?: string | null
          second_half_working_time?: number | null
          start_latitude?: string | null
          start_longitude?: string | null
          stop_latitude?: string | null
          stop_longitude?: string | null
          total_working_hours?: number | null
        }
        Update: {
          attendance_id?: number | null
          created_at?: string
          first_half_working_time?: number | null
          id?: number
          is_paused?: boolean | null
          is_resumed?: boolean | null
          paused_duration?: number | null
          paused_latitude?: string | null
          paused_longitude?: string | null
          resume_latitude?: string | null
          resume_longitude?: string | null
          second_half_working_time?: number | null
          start_latitude?: string | null
          start_longitude?: string | null
          stop_latitude?: string | null
          stop_longitude?: string | null
          total_working_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_attendance_geolocation_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "leap_customer_attendance"
            referencedColumns: ["attendance_id"]
          },
        ]
      }
      leap_customer_bank_details: {
        Row: {
          account_number: string
          bank_name: string
          client_id: number | null
          created_at: string
          customer_id: number | null
          ESIC_number: string | null
          id: number
          IFSC_code: string
          PAN_number: string
          UAN_number: string
        }
        Insert: {
          account_number: string
          bank_name: string
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          ESIC_number?: string | null
          id?: number
          IFSC_code: string
          PAN_number: string
          UAN_number: string
        }
        Update: {
          account_number?: string
          bank_name?: string
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          ESIC_number?: string | null
          id?: number
          IFSC_code?: string
          PAN_number?: string
          UAN_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_bank_details_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_bank_details_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_bank_details_employee_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_customer_documents: {
        Row: {
          bucket_url: string | null
          client_id: number | null
          customer_id: number | null
          doc_type_id: number | null
          id: number
          isEnabled: boolean | null
        }
        Insert: {
          bucket_url?: string | null
          client_id?: number | null
          customer_id?: number | null
          doc_type_id?: number | null
          id?: number
          isEnabled?: boolean | null
        }
        Update: {
          bucket_url?: string | null
          client_id?: number | null
          customer_id?: number | null
          doc_type_id?: number | null
          id?: number
          isEnabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_docs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_docs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_docs_employee_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_customer_documents_doc_type_id_fkey"
            columns: ["doc_type_id"]
            isOneToOne: false
            referencedRelation: "leap_document_type"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_customer_history: {
        Row: {
          created_at: string
          customer_id: number | null
          id: number
          internal_transfer: boolean | null
          previous_employement_name: string | null
          previous_position: string | null
          promotion: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: number | null
          id?: number
          internal_transfer?: boolean | null
          previous_employement_name?: string | null
          previous_position?: string | null
          promotion?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: number | null
          id?: number
          internal_transfer?: boolean | null
          previous_employement_name?: string | null
          previous_position?: string | null
          promotion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_history_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_customer_leave_type: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string
          hasExpiryDays: number | null
          id: number
          is_paid: boolean | null
          isCarryForward: boolean | null
          leave_type_id: number | null
          num_of_days: number | null
          totalDaysPerYear: number | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          hasExpiryDays?: number | null
          id?: number
          is_paid?: boolean | null
          isCarryForward?: boolean | null
          leave_type_id?: number | null
          num_of_days?: number | null
          totalDaysPerYear?: number | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          hasExpiryDays?: number | null
          id?: number
          is_paid?: boolean | null
          isCarryForward?: boolean | null
          leave_type_id?: number | null
          num_of_days?: number | null
          totalDaysPerYear?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_leave_type_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_leave_type_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_leave_type_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_leave_type_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leap_leave_type"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_customer_offboarding: {
        Row: {
          client_id: number
          created_at: string
          customer_id: number
          document: Json | null
          employee_duration: number | null
          employee_name: string | null
          end_date: string | null
          id: number
          remark: string | null
        }
        Insert: {
          client_id: number
          created_at?: string
          customer_id: number
          document?: Json | null
          employee_duration?: number | null
          employee_name?: string | null
          end_date?: string | null
          id?: number
          remark?: string | null
        }
        Update: {
          client_id?: number
          created_at?: string
          customer_id?: number
          document?: Json | null
          employee_duration?: number | null
          employee_name?: string | null
          end_date?: string | null
          id?: number
          remark?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_offboarding_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_offboarding_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_offboarding_employee_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_customer_task: {
        Row: {
          client_id: number | null
          created_at: string
          customer_id: number | null
          date: string | null
          id: number
          project_name: string | null
          task: string | null
          task_type: string | null
          total_hours: string | null
          total_minutes: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          date?: string | null
          id?: number
          project_name?: string | null
          task?: string | null
          task_type?: string | null
          total_hours?: string | null
          total_minutes?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          date?: string | null
          id?: number
          project_name?: string | null
          task?: string | null
          task_type?: string | null
          total_hours?: string | null
          total_minutes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_add_task_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_add_task_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_add_task_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_customer_task_assignment: {
        Row: {
          assigned_by: number | null
          created_at: string
          customer_id: number | null
          deadline: string | null
          id: number
          project_name: string | null
          task_name: string | null
          task_priority: number | null
        }
        Insert: {
          assigned_by?: number | null
          created_at?: string
          customer_id?: number | null
          deadline?: string | null
          id?: number
          project_name?: string | null
          task_name?: string | null
          task_priority?: number | null
        }
        Update: {
          assigned_by?: number | null
          created_at?: string
          customer_id?: number | null
          deadline?: string | null
          id?: number
          project_name?: string | null
          task_name?: string | null
          task_priority?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_task_assignment_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_task_assignment_employee_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_task_assignment_task_priority_fkey"
            columns: ["task_priority"]
            isOneToOne: false
            referencedRelation: "leap_priority_level"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_dashboard_isenable_modules: {
        Row: {
          branch_id: number | null
          client_id: number | null
          id: number
          is_hidden: boolean | null
          mobule_type_id: number | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          id?: number
          is_hidden?: boolean | null
          mobule_type_id?: number | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          id?: number
          is_hidden?: boolean | null
          mobule_type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_dashboard_isenable_modules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_dashboard_isenable_modules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_dashboard_isenable_modules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_dashboard_isenable_modules_mobule_type_id_fkey"
            columns: ["mobule_type_id"]
            isOneToOne: false
            referencedRelation: "leap_all_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_departments: {
        Row: {
          department_name: string | null
          id: number
          is_active: boolean
        }
        Insert: {
          department_name?: string | null
          id?: number
          is_active?: boolean
        }
        Update: {
          department_name?: string | null
          id?: number
          is_active?: boolean
        }
        Relationships: []
      }
      leap_client_designations: {
        Row: {
          department: number | null
          designation_name: string | null
          id: number
        }
        Insert: {
          department?: number | null
          designation_name?: string | null
          id?: number
        }
        Update: {
          department?: number | null
          designation_name?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_designations_department_fkey"
            columns: ["department"]
            isOneToOne: false
            referencedRelation: "leap_client_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_document_type: {
        Row: {
          created_at: string
          document_name: string | null
          id: number
        }
        Insert: {
          created_at?: string
          document_name?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          document_name?: string | null
          id?: number
        }
        Relationships: []
      }
      leap_holiday_list: {
        Row: {
          branch_id: number | null
          client_id: number | null
          date: string | null
          holiday_name: string | null
          holiday_type_id: number | null
          id: number
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          date?: string | null
          holiday_name?: string | null
          holiday_type_id?: number | null
          id?: number
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          date?: string | null
          holiday_name?: string | null
          holiday_type_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "leap_holiday_list_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_holiday_list_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_holiday_list_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_holiday_list_holiday_type_id_fkey"
            columns: ["holiday_type_id"]
            isOneToOne: false
            referencedRelation: "leap_holiday_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_holiday_types: {
        Row: {
          created_at: string
          holiday_type: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          holiday_type?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          holiday_type?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_hrms_token: {
        Row: {
          created_at: string
          id: number
          token_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          token_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          token_id?: string | null
        }
        Relationships: []
      }
      leap_leave_type: {
        Row: {
          created_at: string
          id: number
          type: string
        }
        Insert: {
          created_at?: string
          id?: number
          type: string
        }
        Update: {
          created_at?: string
          id?: number
          type?: string
        }
        Relationships: []
      }
      leap_permission_types: {
        Row: {
          created_at: string
          id: number
          permission_Name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          permission_Name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          permission_Name?: string | null
        }
        Relationships: []
      }
      leap_priority_level: {
        Row: {
          created_at: string
          id: number
          priority_type: string
        }
        Insert: {
          created_at?: string
          id?: number
          priority_type: string
        }
        Update: {
          created_at?: string
          id?: number
          priority_type?: string
        }
        Relationships: []
      }
      leap_project: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string
          id: number
          project_manager: string | null
          project_name: string | null
          project_owner: string | null
          team_lead: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          id?: number
          project_manager?: string | null
          project_name?: string | null
          project_owner?: string | null
          team_lead?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          id?: number
          project_manager?: string | null
          project_name?: string | null
          project_owner?: string | null
          team_lead?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_project_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_project_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_project_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_relations: {
        Row: {
          id: number
          relation_type: string | null
        }
        Insert: {
          id?: number
          relation_type?: string | null
        }
        Update: {
          id?: number
          relation_type?: string | null
        }
        Relationships: []
      }
      leap_salary_component: {
        Row: {
          basic: number | null
          client_id: number | null
          compensatory_allowance: number | null
          conveyance_allowance: number | null
          created_at: string
          customer_id: number | null
          ESIC_deduction: number | null
          extra: number | null
          HRA: number | null
          id: number
          "income_tax(tds)": number | null
          medical_allowance: number | null
          net_payable_salary: number | null
          "professional_tax(pt)": number | null
          provident_fund: number | null
          special_allowance: number | null
          total_deduction: number | null
          total_gross_salary: number | null
        }
        Insert: {
          basic?: number | null
          client_id?: number | null
          compensatory_allowance?: number | null
          conveyance_allowance?: number | null
          created_at?: string
          customer_id?: number | null
          ESIC_deduction?: number | null
          extra?: number | null
          HRA?: number | null
          id?: number
          "income_tax(tds)"?: number | null
          medical_allowance?: number | null
          net_payable_salary?: number | null
          "professional_tax(pt)"?: number | null
          provident_fund?: number | null
          special_allowance?: number | null
          total_deduction?: number | null
          total_gross_salary?: number | null
        }
        Update: {
          basic?: number | null
          client_id?: number | null
          compensatory_allowance?: number | null
          conveyance_allowance?: number | null
          created_at?: string
          customer_id?: number | null
          ESIC_deduction?: number | null
          extra?: number | null
          HRA?: number | null
          id?: number
          "income_tax(tds)"?: number | null
          medical_allowance?: number | null
          net_payable_salary?: number | null
          "professional_tax(pt)"?: number | null
          provident_fund?: number | null
          special_allowance?: number | null
          total_deduction?: number | null
          total_gross_salary?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_salary_component_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_salary_component_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_salary_component_employee_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_salary_structure: {
        Row: {
          created_at: string
          id: number
          index: string
          salary_range: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          index: string
          salary_range?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          index?: string
          salary_range?: string | null
        }
        Relationships: []
      }
      leap_sector_type: {
        Row: {
          id: number
          sector_type: string
        }
        Insert: {
          id?: number
          sector_type: string
        }
        Update: {
          id?: number
          sector_type?: string
        }
        Relationships: []
      }
      leap_set_left_panel_options: {
        Row: {
          created_at: string
          id: number
          menu_name_id: number | null
          role_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          menu_name_id?: number | null
          role_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          menu_name_id?: number | null
          role_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_set_left_panel_options_menu_name_id_fkey"
            columns: ["menu_name_id"]
            isOneToOne: false
            referencedRelation: "leap_web_side_pannel_menu"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_set_left_panel_options_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "leap_user_role"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_time_zone: {
        Row: {
          contry_code: string | null
          created_at: string | null
          difference: string | null
          id: number
          latitude_longitude: string | null
          time_zone_name: string | null
        }
        Insert: {
          contry_code?: string | null
          created_at?: string | null
          difference?: string | null
          id: number
          latitude_longitude?: string | null
          time_zone_name?: string | null
        }
        Update: {
          contry_code?: string | null
          created_at?: string | null
          difference?: string | null
          id?: number
          latitude_longitude?: string | null
          time_zone_name?: string | null
        }
        Relationships: []
      }
      leap_user_authorization: {
        Row: {
          auth_token: string
          created_at: string
          device_id: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth_token: string
          created_at?: string
          device_id?: string | null
          id?: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          auth_token?: string
          created_at?: string
          device_id?: string | null
          id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leap_user_profile: {
        Row: {
          created_at: string | null
          customer_id: number | null
          email: string | null
          id: number
          user_role_id: number | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: number | null
          email?: string | null
          id?: number
          user_role_id?: number | null
          uuid?: string
        }
        Update: {
          created_at?: string | null
          customer_id?: number | null
          email?: string | null
          id?: number
          user_role_id?: number | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "leap_user_profile_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_user_profile_user_role_id_fkey"
            columns: ["user_role_id"]
            isOneToOne: false
            referencedRelation: "leap_user_role"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_user_role: {
        Row: {
          created_at: string
          id: number
          user_role: string
        }
        Insert: {
          created_at?: string
          id?: number
          user_role: string
        }
        Update: {
          created_at?: string
          id?: number
          user_role?: string
        }
        Relationships: []
      }
      leap_web_side_pannel_menu: {
        Row: {
          created_at: string | null
          id: number
          menu_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          menu_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          menu_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_web_sidepannel_menu_isenabled: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          id: number
          isEnabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          isEnabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          isEnabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_web_sidepannel_menu_isenabled_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_web_sidepannel_menu_isenabled_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_web_sidepannel_menu_isenabled_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_working_type: {
        Row: {
          created_at: string
          id: number
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          type?: string | null
        }
        Relationships: []
      }
      leap_yearly_leave: {
        Row: {
          client_id: number | null
          created_at: string
          customer_id: number | null
          id: number
          total_leave_left: number | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          total_leave_left?: number | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          total_leave_left?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_yearly_leave_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_yearly_leave_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_yearly_leave_employee_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
    }
    Views: {
      demo_client: {
        Row: {
          branch_address: string | null
          client_id: number | null
          company_email: string | null
          company_name: string | null
          total_employees: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      fun1: {
        Args: {
          client_id_param: number
        }
        Returns: {
          client_id: number
          leave_type_id: number
          type: string
          is_paid: boolean
          iscarryforward: boolean
          num_of_days: number
          totaldaysperyear: number
          hasexpirydays: number
        }[]
      }
      get_client_holiday_list: {
        Args: {
          client_id: number
          branch_id: number
          target_year: number
        }
        Returns: {
          branch_id: number | null
          client_id: number | null
          date: string | null
          holiday_name: string | null
          holiday_type_id: number | null
          id: number
        }[]
      }
      get_client_holiday_list1: {
        Args: {
          client_id: number
          branch_id: number
          target_year: number
        }
        Returns: {
          branch_id: number | null
          client_id: number | null
          date: string | null
          holiday_name: string | null
          holiday_type_id: number | null
          id: number
        }[]
      }
      get_holidays_by_year:
        | {
            Args: {
              client_id: number
              branch_id: number
              target_year: number
            }
            Returns: {
              branch_id: number | null
              client_id: number | null
              date: string | null
              holiday_name: string | null
              holiday_type_id: number | null
              id: number
            }[]
          }
        | {
            Args: {
              client_id: string
              branch_id: string
              target_year: number
            }
            Returns: {
              branch_id: number | null
              client_id: number | null
              date: string | null
              holiday_name: string | null
              holiday_type_id: number | null
              id: number
            }[]
          }
        | {
            Args: {
              target_year: number
            }
            Returns: {
              branch_id: number | null
              client_id: number | null
              date: string | null
              holiday_name: string | null
              holiday_type_id: number | null
              id: number
            }[]
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
