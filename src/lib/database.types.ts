export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.2 (db9da0b)"
  }
  public: {
    Tables: {
      app_versioning: {
        Row: {
          app_url: string | null
          app_version: number | null
          created_at: string | null
          force_update: number | null
          id: number
          platform: string | null
          update_at: string | null
        }
        Insert: {
          app_url?: string | null
          app_version?: number | null
          created_at?: string | null
          force_update?: number | null
          id?: number
          platform?: string | null
          update_at?: string | null
        }
        Update: {
          app_url?: string | null
          app_version?: number | null
          created_at?: string | null
          force_update?: number | null
          id?: number
          platform?: string | null
          update_at?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          client_id: number | null
          created_at: string | null
          customer_id: number | null
          error_json: Json | null
          error_title: string | null
          id: number
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          error_json?: Json | null
          error_title?: string | null
          id?: number
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          error_json?: Json | null
          error_title?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "error_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "error_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
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
          created_at: string | null
          customer_id: number | null
          id: number
          is_enabled: boolean | null
          ocassion: string | null
          ocassion_date: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          is_enabled?: boolean | null
          ocassion?: string | null
          ocassion_date?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          is_enabled?: boolean | null
          ocassion?: string | null
          ocassion_date?: string | null
          updated_at?: string | null
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
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          module_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          module_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_announcement_types: {
        Row: {
          announcement_type: string | null
          announcement_type_id: number
          announcement_type_info: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          announcement_type?: string | null
          announcement_type_id?: number
          announcement_type_info?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          announcement_type?: string | null
          announcement_type_id?: number
          announcement_type_info?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_api_error_logs: {
        Row: {
          action_type: string | null
          client_id: number | null
          created_at: string | null
          details_log: Json | null
          id: number
          updated_at: string | null
        }
        Insert: {
          action_type?: string | null
          client_id?: number | null
          created_at?: string | null
          details_log?: Json | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          action_type?: string | null
          client_id?: number | null
          created_at?: string | null
          details_log?: Json | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_api_error_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_api_error_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
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
          created_at: string
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
          is_deleted: boolean | null
          updated_at: string | null
        }
        Insert: {
          approval_type: string
          created_at: string
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          approval_type?: string
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_asset: {
        Row: {
          asset_id: number
          asset_name: string
          asset_pic: string[] | null
          asset_status: number | null
          asset_type: number | null
          branch_id: number | null
          client_id: number | null
          condition: number | null
          configuration: string | null
          created_at: string | null
          device_code: string | null
          is_deleted: boolean | null
          purchased_at: string | null
          remark: string | null
          updated_at: string | null
          vendor_bill: string | null
          warranty_date: string | null
        }
        Insert: {
          asset_id?: number
          asset_name: string
          asset_pic?: string[] | null
          asset_status?: number | null
          asset_type?: number | null
          branch_id?: number | null
          client_id?: number | null
          condition?: number | null
          configuration?: string | null
          created_at?: string | null
          device_code?: string | null
          is_deleted?: boolean | null
          purchased_at?: string | null
          remark?: string | null
          updated_at?: string | null
          vendor_bill?: string | null
          warranty_date?: string | null
        }
        Update: {
          asset_id?: number
          asset_name?: string
          asset_pic?: string[] | null
          asset_status?: number | null
          asset_type?: number | null
          branch_id?: number | null
          client_id?: number | null
          condition?: number | null
          configuration?: string | null
          created_at?: string | null
          device_code?: string | null
          is_deleted?: boolean | null
          purchased_at?: string | null
          remark?: string | null
          updated_at?: string | null
          vendor_bill?: string | null
          warranty_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_asset_asset_status_fkey"
            columns: ["asset_status"]
            isOneToOne: false
            referencedRelation: "leap_asset_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_asset_asset_type_fkey"
            columns: ["asset_type"]
            isOneToOne: false
            referencedRelation: "leap_asset_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_asset_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_asset_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_asset_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_asset_condition_fkey"
            columns: ["condition"]
            isOneToOne: false
            referencedRelation: "leap_asset_condition"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_asset_condition: {
        Row: {
          condition: string | null
          created_at: string
          id: number
          is_deleted: boolean | null
          updated_at: string | null
        }
        Insert: {
          condition?: string | null
          created_at: string
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          condition?: string | null
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_asset_status: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          id?: number
          is_deleted?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_asset_type: {
        Row: {
          asset_type: string | null
          client_id: number | null
          created_at: string
          id: number
          is_deleted: boolean | null
        }
        Insert: {
          asset_type?: string | null
          client_id?: number | null
          created_at?: string
          id?: number
          is_deleted?: boolean | null
        }
        Update: {
          asset_type?: string | null
          client_id?: number | null
          created_at?: string
          id?: number
          is_deleted?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_asset_type_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_asset_type_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_attendance_tracking: {
        Row: {
          attendance_id: number | null
          client_id: number | null
          created_at: string
          id: number
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          attendance_id?: number | null
          client_id?: number | null
          created_at?: string
          id?: number
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          attendance_id?: number | null
          client_id?: number | null
          created_at?: string
          id?: number
          latitude?: number | null
          longitude?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_attendance_tracking_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "leap_customer_attendance"
            referencedColumns: ["attendance_id"]
          },
          {
            foreignKeyName: "leap_attendance_tracking_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_attendance_tracking_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
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
          updated_at: string | null
          weekend_days: string | null
        }
        Insert: {
          branch_id: number
          client_id: number
          created_at: string
          day_end?: string | null
          day_start?: string | null
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
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
          updated_at?: string | null
          weekend_days?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_branch_weekends_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: true
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_branch_weekends_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_branch_weekends_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_city: {
        Row: {
          city: string | null
          id: number
          is_deleted: boolean | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          id?: number
          is_deleted?: boolean | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          id?: number
          is_deleted?: boolean | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_client: {
        Row: {
          client_id: number
          company_email: string | null
          company_location: string | null
          company_name: string
          company_number: string | null
          company_website_url: string | null
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
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: number
          company_email?: string | null
          company_location?: string | null
          company_name: string
          company_number?: string | null
          company_website_url?: string | null
          created_at: string
          fullday_working_hours?: number | null
          halfday_working_hours?: number | null
          is_a_parent?: boolean
          is_deleted?: boolean
          number_of_branches?: number | null
          parent_id?: number | null
          sector_type?: string | null
          timezone_id?: number | null
          total_weekend_days?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: number
          company_email?: string | null
          company_location?: string | null
          company_name?: string
          company_number?: string | null
          company_website_url?: string | null
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
          updated_at?: string | null
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
      leap_client_admin_mid_shortcuts: {
        Row: {
          client_id: number | null
          created_at: string | null
          id: number
          mid_shortcut_id: number | null
          show_on_dashboard: boolean | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          id?: number
          mid_shortcut_id?: number | null
          show_on_dashboard?: boolean | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          id?: number
          mid_shortcut_id?: number | null
          show_on_dashboard?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_admin_shortcuts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_admin_shortcuts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_admin_shortcuts_mid_shortcut_id_fkey"
            columns: ["mid_shortcut_id"]
            isOneToOne: false
            referencedRelation: "leap_dashboard_mid_shortcut"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_announcements: {
        Row: {
          announcement_date: string | null
          announcement_details: string | null
          announcement_id: number
          announcement_image: string | null
          announcement_title: string | null
          announcement_type_id: number | null
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          isDeleted: boolean | null
          isEnabled: boolean | null
          num_of_days: number | null
          send_on_date: string | null
          send_to_all: boolean | null
          updated_at: string | null
          validity_date: string | null
        }
        Insert: {
          announcement_date?: string | null
          announcement_details?: string | null
          announcement_id?: number
          announcement_image?: string | null
          announcement_title?: string | null
          announcement_type_id?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          isDeleted?: boolean | null
          isEnabled?: boolean | null
          num_of_days?: number | null
          send_on_date?: string | null
          send_to_all?: boolean | null
          updated_at?: string | null
          validity_date?: string | null
        }
        Update: {
          announcement_date?: string | null
          announcement_details?: string | null
          announcement_id?: number
          announcement_image?: string | null
          announcement_title?: string | null
          announcement_type_id?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          isDeleted?: boolean | null
          isEnabled?: boolean | null
          num_of_days?: number | null
          send_on_date?: string | null
          send_to_all?: boolean | null
          updated_at?: string | null
          validity_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_announcements_announcement_type_id_fkey"
            columns: ["announcement_type_id"]
            isOneToOne: false
            referencedRelation: "leap_announcement_types"
            referencedColumns: ["announcement_type_id"]
          },
          {
            foreignKeyName: "leap_client_announcements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_announcements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_announcements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_client_bank_details_components: {
        Row: {
          branch_id: number | null
          client_id: number | null
          component_name: string | null
          created_at: string | null
          data_type: number | null
          id: number
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          component_name?: string | null
          created_at?: string | null
          data_type?: number | null
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          component_name?: string | null
          created_at?: string | null
          data_type?: number | null
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_bank_details_components_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_bank_details_components_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_bank_details_components_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_client_basic_info: {
        Row: {
          client_basic_detail_id: number
          client_id: number | null
          company_logo: string | null
          company_name: string | null
          company_short_name: string | null
          compnay_websit: string | null
          created_at: string | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string | null
        }
        Insert: {
          client_basic_detail_id?: number
          client_id?: number | null
          company_logo?: string | null
          company_name?: string | null
          company_short_name?: string | null
          compnay_websit?: string | null
          created_at?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Update: {
          client_basic_detail_id?: number
          client_id?: number | null
          company_logo?: string | null
          company_name?: string | null
          company_short_name?: string | null
          compnay_websit?: string | null
          created_at?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_basic_info_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_basic_info_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
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
          contact_details: number | null
          created_at: string | null
          id: number
          is_active: boolean
          is_main_branch: boolean | null
          time_zone_id: number | null
          total_employees: number | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          branch_address?: string | null
          branch_city: string
          branch_email: string
          branch_number?: string | null
          client_id: number
          contact_details?: number | null
          created_at?: string | null
          id?: number
          is_active?: boolean
          is_main_branch?: boolean | null
          time_zone_id?: number | null
          total_employees?: number | null
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          branch_address?: string | null
          branch_city?: string
          branch_email?: string
          branch_number?: string | null
          client_id?: number
          contact_details?: number | null
          created_at?: string | null
          id?: number
          is_active?: boolean
          is_main_branch?: boolean | null
          time_zone_id?: number | null
          total_employees?: number | null
          updated_at?: string | null
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
      leap_client_dashboard_shortcuts_one: {
        Row: {
          client_id: number | null
          created_at: string | null
          is_active: boolean | null
          selected_shortcut_id: number
          shortcut_id: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          is_active?: boolean | null
          selected_shortcut_id?: number
          shortcut_id?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          is_active?: boolean | null
          selected_shortcut_id?: number
          shortcut_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_dashboard_shortcuts_one_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_dashboard_shortcuts_one_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_dashboard_shortcuts_one_shortcut_id_fkey"
            columns: ["shortcut_id"]
            isOneToOne: false
            referencedRelation: "leap_dashboard_shortcuts"
            referencedColumns: ["shortcut_id"]
          },
        ]
      }
      leap_client_departments: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          department_id: number
          department_name: string | null
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          department_id?: number
          department_name?: string | null
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          department_id?: number
          department_name?: string | null
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_departments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_departments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_departments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_client_designations: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          designation_id: number
          designation_name: string | null
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          designation_id?: number
          designation_name?: string | null
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          designation_id?: number
          designation_name?: string | null
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_designations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_designations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_designations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_client_documents: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          document_type_id: number | null
          document_url: string | null
          from_date: string | null
          id: number
          show_to_employees: boolean | null
          till_date: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          document_type_id?: number | null
          document_url?: string | null
          from_date?: string | null
          id?: number
          show_to_employees?: boolean | null
          till_date?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          document_type_id?: number | null
          document_url?: string | null
          from_date?: string | null
          id?: number
          show_to_employees?: boolean | null
          till_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_documents_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_documents_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "leap_document_type"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_employee_permission_types: {
        Row: {
          created_at: string | null
          emp_permission_id: number
          is_deleted: boolean | null
          permission_name: string | null
          type_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          emp_permission_id?: number
          is_deleted?: boolean | null
          permission_name?: string | null
          type_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          emp_permission_id?: number
          is_deleted?: boolean | null
          permission_name?: string | null
          type_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_employee_permission_types_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "leap_permission_master"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_employee_permissions: {
        Row: {
          client_id: number | null
          created_at: string | null
          customer_id: number | null
          id: number
          is_allowed: boolean | null
          permission_id: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          is_allowed?: boolean | null
          permission_id?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          is_allowed?: boolean | null
          permission_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_employee_permissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_employee_permissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_employee_permissions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_client_employee_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "leap_client_employee_permission_types"
            referencedColumns: ["emp_permission_id"]
          },
        ]
      }
      leap_client_employee_requests: {
        Row: {
          active_status: number | null
          branch_id: number | null
          client_id: number | null
          created_at: string
          customer_id: number | null
          description: string | null
          id: number
          priority_level: number | null
          raised_on: string | null
          ticket_id: string | null
          type_id: number | null
          updated_at: string | null
        }
        Insert: {
          active_status?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at: string
          customer_id?: number | null
          description?: string | null
          id?: number
          priority_level?: number | null
          raised_on?: string | null
          ticket_id?: string | null
          type_id?: number | null
          updated_at?: string | null
        }
        Update: {
          active_status?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          description?: string | null
          id?: number
          priority_level?: number | null
          raised_on?: string | null
          ticket_id?: string | null
          type_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_employee_requests_active_status_fkey"
            columns: ["active_status"]
            isOneToOne: false
            referencedRelation: "leap_request_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_employee_requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_employee_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_employee_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_employee_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_client_employee_requests_priority_level_fkey"
            columns: ["priority_level"]
            isOneToOne: false
            referencedRelation: "leap_request_priority"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_employee_requests_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "leap_request_master"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_employee_requests_updates: {
        Row: {
          comments: string | null
          created_at: string | null
          customer_id: number | null
          request_id: number | null
          request_updates_id: number
          status: number | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          customer_id?: number | null
          request_id?: number | null
          request_updates_id?: number
          status?: number | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          customer_id?: number | null
          request_id?: number | null
          request_updates_id?: number
          status?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_employee_requests_updates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_client_employee_requests_updates_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "leap_client_employee_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_employee_requests_updates_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "leap_request_status"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_employee_salary: {
        Row: {
          amount: number | null
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          customer_id: number | null
          id: number
          pay_accural_id: number | null
          salary_component_id: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          pay_accural_id?: number | null
          salary_component_id?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          pay_accural_id?: number | null
          salary_component_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_employee_salary_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_employee_salary_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_employee_salary_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_employee_salary_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_client_employee_salary_pay_accural_id_fkey"
            columns: ["pay_accural_id"]
            isOneToOne: false
            referencedRelation: "leap_salary_payable_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_employee_salary_salary_component_id_fkey"
            columns: ["salary_component_id"]
            isOneToOne: false
            referencedRelation: "leap_client_salary_components"
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
      leap_client_leave: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string
          gender: string | null
          icon_type_id: number | null
          if_unused: string | null
          leave_accrual: string | null
          leave_category: string | null
          leave_count: number | null
          leave_discription: string | null
          leave_id: number
          leave_name: string | null
          user_role_applicable: string | null
          validPeriod: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          gender?: string | null
          icon_type_id?: number | null
          if_unused?: string | null
          leave_accrual?: string | null
          leave_category?: string | null
          leave_count?: number | null
          leave_discription?: string | null
          leave_id?: number
          leave_name?: string | null
          user_role_applicable?: string | null
          validPeriod?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          gender?: string | null
          icon_type_id?: number | null
          if_unused?: string | null
          leave_accrual?: string | null
          leave_category?: string | null
          leave_count?: number | null
          leave_discription?: string | null
          leave_id?: number
          leave_name?: string | null
          user_role_applicable?: string | null
          validPeriod?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_leave_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_leave_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_leave_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_leave_icon_type_id_fkey"
            columns: ["icon_type_id"]
            isOneToOne: false
            referencedRelation: "leap_leave_type_icon_and_color"
            referencedColumns: ["leave_type_icon_id"]
          },
        ]
      }
      leap_client_module_permission: {
        Row: {
          client_id: number | null
          created_at: string
          enable: boolean | null
          id: number
          module_id: number | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          enable?: boolean | null
          id?: number
          module_id?: number | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          enable?: boolean | null
          id?: number
          module_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_module_permission_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_module_permission_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_module_permission_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "leap_permission_master"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_notification_selected_types: {
        Row: {
          client_id: number | null
          created_at: string | null
          pk_id: number
          selected_notify_type_id: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          pk_id?: number
          selected_notify_type_id?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          pk_id?: number
          selected_notify_type_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_notification_selected__selected_notify_type_id_fkey"
            columns: ["selected_notify_type_id"]
            isOneToOne: false
            referencedRelation: "leap_push_notification_types"
            referencedColumns: ["notify_type_id"]
          },
          {
            foreignKeyName: "leap_client_notification_selected_types_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_notification_selected_types_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_client_permission: {
        Row: {
          client_id: number | null
          created_at: string
          id: number
          is_enabled: boolean | null
          permission_type_id: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at: string
          id?: number
          is_enabled?: boolean | null
          permission_type_id?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          id?: number
          is_enabled?: boolean | null
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
            referencedRelation: "leap_client_employee_permission_types"
            referencedColumns: ["emp_permission_id"]
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
          updated_at: string | null
          year: string | null
        }
        Insert: {
          client_id?: number | null
          created_at: string
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
          updated_at?: string | null
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
          updated_at?: string | null
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
      leap_client_project: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string
          is_deleted: boolean | null
          project_client: string | null
          project_color_code: string | null
          project_id: number
          project_logo: string | null
          project_manager_id: number | null
          project_name: string | null
          project_status: number | null
          project_type_id: number | null
          team_lead_id: number | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at: string
          is_deleted?: boolean | null
          project_client?: string | null
          project_color_code?: string | null
          project_id?: number
          project_logo?: string | null
          project_manager_id?: number | null
          project_name?: string | null
          project_status?: number | null
          project_type_id?: number | null
          team_lead_id?: number | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          is_deleted?: boolean | null
          project_client?: string | null
          project_color_code?: string | null
          project_id?: number
          project_logo?: string | null
          project_manager_id?: number | null
          project_name?: string | null
          project_status?: number | null
          project_type_id?: number | null
          team_lead_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_project_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_client_project_project_status_fkey"
            columns: ["project_status"]
            isOneToOne: false
            referencedRelation: "leap_project_status"
            referencedColumns: ["project_status_id"]
          },
          {
            foreignKeyName: "leap_client_project_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "leap_project_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_project_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
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
      leap_client_salary_components: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          id: number
          is_active: boolean | null
          is_deleted: boolean
          pay_accural: number | null
          pay_percentage: number | null
          salary_component_id: number | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          is_deleted?: boolean
          pay_accural?: number | null
          pay_percentage?: number | null
          salary_component_id?: number | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          is_deleted?: boolean
          pay_accural?: number | null
          pay_percentage?: number | null
          salary_component_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_salary_components_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_salary_components_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_salary_components_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_salary_components_pay_accural_fkey"
            columns: ["pay_accural"]
            isOneToOne: false
            referencedRelation: "leap_salary_payable_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_salary_components_salary_component_id_fkey"
            columns: ["salary_component_id"]
            isOneToOne: false
            referencedRelation: "leap_salary_components"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_client_sub_projects: {
        Row: {
          branch_id: number | null
          client_id: number | null
          completion_percentage: number | null
          created_at: string | null
          department_id: number | null
          end_date: string | null
          is_deleted: boolean | null
          project_details: string | null
          project_id: number | null
          project_manager_id: number | null
          project_type_id: number | null
          start_date: string | null
          sub_project_name: string | null
          sub_project_status: number | null
          subproject_id: number
          tech_stacks: number[] | null
          update_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          department_id?: number | null
          end_date?: string | null
          is_deleted?: boolean | null
          project_details?: string | null
          project_id?: number | null
          project_manager_id?: number | null
          project_type_id?: number | null
          start_date?: string | null
          sub_project_name?: string | null
          sub_project_status?: number | null
          subproject_id?: number
          tech_stacks?: number[] | null
          update_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          department_id?: number | null
          end_date?: string | null
          is_deleted?: boolean | null
          project_details?: string | null
          project_id?: number | null
          project_manager_id?: number | null
          project_type_id?: number | null
          start_date?: string | null
          sub_project_name?: string | null
          sub_project_status?: number | null
          subproject_id?: number
          tech_stacks?: number[] | null
          update_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_sub_projects_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_sub_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_sub_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_sub_projects_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "leap_client_departments"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "leap_client_sub_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "leap_client_project"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "leap_client_sub_projects_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_client_sub_projects_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "leap_project_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_sub_projects_sub_project_status_fkey"
            columns: ["sub_project_status"]
            isOneToOne: false
            referencedRelation: "leap_project_status"
            referencedColumns: ["project_status_id"]
          },
        ]
      }
      leap_client_useractivites: {
        Row: {
          activity_details: string | null
          activity_related_id: number | null
          activity_status: number | null
          activity_type_id: number | null
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          customer_id: number | null
          customer_image: string | null
          customer_name: string | null
          department_name: string | null
          designation_name: string | null
          id: number
          updated_at: string | null
          user_notify: boolean | null
        }
        Insert: {
          activity_details?: string | null
          activity_related_id?: number | null
          activity_status?: number | null
          activity_type_id?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          customer_image?: string | null
          customer_name?: string | null
          department_name?: string | null
          designation_name?: string | null
          id?: number
          updated_at?: string | null
          user_notify?: boolean | null
        }
        Update: {
          activity_details?: string | null
          activity_related_id?: number | null
          activity_status?: number | null
          activity_type_id?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          customer_image?: string | null
          customer_name?: string | null
          department_name?: string | null
          designation_name?: string | null
          id?: number
          updated_at?: string | null
          user_notify?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_useractivites_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "leap_user_activity_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_useractivites_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_useractivites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_useractivites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_client_useractivites_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_client_working_hour_policy: {
        Row: {
          branch_id: number
          client_id: number | null
          created_at: string
          full_day: number | null
          half_day: number | null
          holiday_per_week: number | null
          id: number
          lunch_time: number | null
          payable_type: number | null
          role_id: number | null
          updated_at: string | null
        }
        Insert: {
          branch_id: number
          client_id?: number | null
          created_at: string
          full_day?: number | null
          half_day?: number | null
          holiday_per_week?: number | null
          id?: number
          lunch_time?: number | null
          payable_type?: number | null
          role_id?: number | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number
          client_id?: number | null
          created_at?: string
          full_day?: number | null
          half_day?: number | null
          holiday_per_week?: number | null
          id?: number
          lunch_time?: number | null
          payable_type?: number | null
          role_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_client_working_hour_policy_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: true
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
          {
            foreignKeyName: "leap_client_working_hour_policy_payable_type_fkey"
            columns: ["payable_type"]
            isOneToOne: false
            referencedRelation: "leap_salary_payable_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_client_working_hour_policy_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "leap_user_role"
            referencedColumns: ["id"]
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
          updated_at: string | null
          user_id: number | null
          user_name: string | null
        }
        Insert: {
          created_at: string
          id?: number
          is_deleted?: boolean | null
          password?: string | null
          updated_at?: string | null
          user_id?: number | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          password?: string | null
          updated_at?: string | null
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
      leap_customer: {
        Row: {
          alternateContact: number | null
          auth_token: string | null
          authUuid: string | null
          blood_group: string | null
          branch_id: number | null
          client_id: number
          contact_name: string | null
          contact_number: string | null
          created_at: string
          customer_id: number
          date_of_joining: string | null
          department_id: number | null
          designation_id: number | null
          device_id: string | null
          dob: string | null
          email_id: string
          emergency_contact: number | null
          emp_id: string
          employment_status: boolean
          employment_type: number | null
          gender: string | null
          id: string
          manager_id: number | null
          marital_status: string | null
          name: string | null
          nationality: string | null
          notification_enabled: boolean | null
          official_onboard_date: string | null
          personalEmail: string | null
          probation_period: string | null
          profile_pic: string | null
          relation: number | null
          salary_structure: string | null
          updated_at: string | null
          user_role: number | null
          work_location: string | null
          work_mode: number | null
        }
        Insert: {
          alternateContact?: number | null
          auth_token?: string | null
          authUuid?: string | null
          blood_group?: string | null
          branch_id?: number | null
          client_id: number
          contact_name?: string | null
          contact_number?: string | null
          created_at: string
          customer_id?: number
          date_of_joining?: string | null
          department_id?: number | null
          designation_id?: number | null
          device_id?: string | null
          dob?: string | null
          email_id: string
          emergency_contact?: number | null
          emp_id: string
          employment_status?: boolean
          employment_type?: number | null
          gender?: string | null
          id?: string
          manager_id?: number | null
          marital_status?: string | null
          name?: string | null
          nationality?: string | null
          notification_enabled?: boolean | null
          official_onboard_date?: string | null
          personalEmail?: string | null
          probation_period?: string | null
          profile_pic?: string | null
          relation?: number | null
          salary_structure?: string | null
          updated_at?: string | null
          user_role?: number | null
          work_location?: string | null
          work_mode?: number | null
        }
        Update: {
          alternateContact?: number | null
          auth_token?: string | null
          authUuid?: string | null
          blood_group?: string | null
          branch_id?: number | null
          client_id?: number
          contact_name?: string | null
          contact_number?: string | null
          created_at?: string
          customer_id?: number
          date_of_joining?: string | null
          department_id?: number | null
          designation_id?: number | null
          device_id?: string | null
          dob?: string | null
          email_id?: string
          emergency_contact?: number | null
          emp_id?: string
          employment_status?: boolean
          employment_type?: number | null
          gender?: string | null
          id?: string
          manager_id?: number | null
          marital_status?: string | null
          name?: string | null
          nationality?: string | null
          notification_enabled?: boolean | null
          official_onboard_date?: string | null
          personalEmail?: string | null
          probation_period?: string | null
          profile_pic?: string | null
          relation?: number | null
          salary_structure?: string | null
          updated_at?: string | null
          user_role?: number | null
          work_location?: string | null
          work_mode?: number | null
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
            foreignKeyName: "leap_customer_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "leap_client_departments"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "leap_customer_designation_id_fkey"
            columns: ["designation_id"]
            isOneToOne: false
            referencedRelation: "leap_client_designations"
            referencedColumns: ["designation_id"]
          },
          {
            foreignKeyName: "leap_customer_employment_type_fkey"
            columns: ["employment_type"]
            isOneToOne: false
            referencedRelation: "leap_employement_type"
            referencedColumns: ["employment_type_id"]
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
          {
            foreignKeyName: "leap_customer_work_mode_fkey"
            columns: ["work_mode"]
            isOneToOne: false
            referencedRelation: "leap_working_type"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_customer_address: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          address_type: Database["public"]["Enums"]["address_type"] | null
          branch_id: number | null
          city: string | null
          client_id: number | null
          country: string | null
          created_at: string | null
          customer_id: number | null
          id: number
          is_primary: boolean | null
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          address_type?: Database["public"]["Enums"]["address_type"] | null
          branch_id?: number | null
          city?: string | null
          client_id?: number | null
          country?: string | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          address_type?: Database["public"]["Enums"]["address_type"] | null
          branch_id?: number | null
          city?: string | null
          client_id?: number | null
          country?: string | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_address_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_address_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_address_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_address_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
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
          duration: string | null
          from_date: string | null
          id: number
          isAssigned: boolean | null
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
          created_at: string
          customer_id?: number | null
          duration?: string | null
          from_date?: string | null
          id?: number
          isAssigned?: boolean | null
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
          duration?: string | null
          from_date?: string | null
          id?: number
          isAssigned?: boolean | null
          leave_reason?: string | null
          leave_status?: number | null
          leave_type?: number | null
          to_date?: string | null
          total_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_apply_leave_leave_type_fkey"
            columns: ["leave_type"]
            isOneToOne: false
            referencedRelation: "leap_client_leave"
            referencedColumns: ["leave_id"]
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
        ]
      }
      leap_customer_asset: {
        Row: {
          asset_id: number | null
          asset_pic: string[] | null
          assigned_duration: string | null
          branch_id: number | null
          client_id: number | null
          customer_id: number | null
          date_given: string
          date_of_return: string | null
          id: number
          is_active: boolean | null
          remark: string | null
        }
        Insert: {
          asset_id?: number | null
          asset_pic?: string[] | null
          assigned_duration?: string | null
          branch_id?: number | null
          client_id?: number | null
          customer_id?: number | null
          date_given: string
          date_of_return?: string | null
          id?: number
          is_active?: boolean | null
          remark?: string | null
        }
        Update: {
          asset_id?: number | null
          asset_pic?: string[] | null
          assigned_duration?: string | null
          branch_id?: number | null
          client_id?: number | null
          customer_id?: number | null
          date_given?: string
          date_of_return?: string | null
          id?: number
          is_active?: boolean | null
          remark?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_asset_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "leap_asset"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "leap_customer_asset_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_asset_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_asset_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_asset_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_customer_attendance: {
        Row: {
          approval_status: number | null
          approved_by: number | null
          attendance_id: number
          attendanceStatus: number | null
          client_id: number | null
          created_at: string | null
          customer_id: number | null
          date: string
          if_paused: boolean | null
          img_attachment: string | null
          in_time: string | null
          out_time: string | null
          pause_end_time: string[] | null
          pause_start_time: string[] | null
          paused_duration: number | null
          paused_reasons: string[] | null
          remark: string | null
          total_hours: number | null
          updated_at: string | null
          working_type_id: number | null
        }
        Insert: {
          approval_status?: number | null
          approved_by?: number | null
          attendance_id?: number
          attendanceStatus?: number | null
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          date: string
          if_paused?: boolean | null
          img_attachment?: string | null
          in_time?: string | null
          out_time?: string | null
          pause_end_time?: string[] | null
          pause_start_time?: string[] | null
          paused_duration?: number | null
          paused_reasons?: string[] | null
          remark?: string | null
          total_hours?: number | null
          updated_at?: string | null
          working_type_id?: number | null
        }
        Update: {
          approval_status?: number | null
          approved_by?: number | null
          attendance_id?: number
          attendanceStatus?: number | null
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          date?: string
          if_paused?: boolean | null
          img_attachment?: string | null
          in_time?: string | null
          out_time?: string | null
          pause_end_time?: string[] | null
          pause_start_time?: string[] | null
          paused_duration?: number | null
          paused_reasons?: string[] | null
          remark?: string | null
          total_hours?: number | null
          updated_at?: string | null
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
        ]
      }
      leap_customer_attendance_geolocation: {
        Row: {
          attendance_id: number | null
          created_at: string | null
          id: number
          is_paused: boolean | null
          pause_location: unknown[] | null
          resume_location: unknown[] | null
          start_location: unknown[] | null
          stop_location: unknown | null
          total_working_hours: number | null
          updated_at: string | null
        }
        Insert: {
          attendance_id?: number | null
          created_at?: string | null
          id?: number
          is_paused?: boolean | null
          pause_location?: unknown[] | null
          resume_location?: unknown[] | null
          start_location?: unknown[] | null
          stop_location?: unknown | null
          total_working_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          attendance_id?: number | null
          created_at?: string | null
          id?: number
          is_paused?: boolean | null
          pause_location?: unknown[] | null
          resume_location?: unknown[] | null
          start_location?: unknown[] | null
          stop_location?: unknown | null
          total_working_hours?: number | null
          updated_at?: string | null
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
          bank_account_count_id: number | null
          bank_component_id: number | null
          client_id: number | null
          component_value: string | null
          created_at: string | null
          customer_id: number | null
          id: number
          updated_at: string | null
        }
        Insert: {
          bank_account_count_id?: number | null
          bank_component_id?: number | null
          client_id?: number | null
          component_value?: string | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          bank_account_count_id?: number | null
          bank_component_id?: number | null
          client_id?: number | null
          component_value?: string | null
          created_at?: string | null
          customer_id?: number | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_bank_details_bank_account_count_id_fkey"
            columns: ["bank_account_count_id"]
            isOneToOne: false
            referencedRelation: "leap_employee_bank_accounte_count"
            referencedColumns: ["bank_account_count_id"]
          },
          {
            foreignKeyName: "leap_customer_bank_details_bank_component_id_fkey"
            columns: ["bank_component_id"]
            isOneToOne: false
            referencedRelation: "leap_client_bank_details_components"
            referencedColumns: ["id"]
          },
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
          created_at: string | null
          customer_id: number | null
          doc_type_id: number | null
          id: number
          isEnabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          bucket_url?: string | null
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          doc_type_id?: number | null
          id?: number
          isEnabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          bucket_url?: string | null
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          doc_type_id?: number | null
          id?: number
          isEnabled?: boolean | null
          updated_at?: string | null
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
      leap_customer_fcm_tokens: {
        Row: {
          created_at: string | null
          customer_id: number | null
          device_id: string | null
          fcm_token: string | null
          fcm_token_pk_id: number
          platform: string | null
          updated_at: string | null
          web_fcm_tokens: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: number | null
          device_id?: string | null
          fcm_token?: string | null
          fcm_token_pk_id?: number
          platform?: string | null
          updated_at?: string | null
          web_fcm_tokens?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: number | null
          device_id?: string | null
          fcm_token?: string | null
          fcm_token_pk_id?: number
          platform?: string | null
          updated_at?: string | null
          web_fcm_tokens?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_fcm_tokens_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
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
          updated_at: string | null
        }
        Insert: {
          created_at: string
          customer_id?: number | null
          id?: number
          internal_transfer?: boolean | null
          previous_employement_name?: string | null
          previous_position?: string | null
          promotion?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: number | null
          id?: number
          internal_transfer?: boolean | null
          previous_employement_name?: string | null
          previous_position?: string | null
          promotion?: string | null
          updated_at?: string | null
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
      leap_customer_offboarding: {
        Row: {
          client_id: number
          created_at: string
          customer_id: number
          employee_duration: number | null
          employee_name: string | null
          end_date: string | null
          id: number
          remark: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: number
          created_at: string
          customer_id: number
          employee_duration?: number | null
          employee_name?: string | null
          end_date?: string | null
          id?: number
          remark?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number
          created_at?: string
          customer_id?: number
          employee_duration?: number | null
          employee_name?: string | null
          end_date?: string | null
          id?: number
          remark?: string | null
          updated_at?: string | null
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
      leap_customer_project_task: {
        Row: {
          approval_status: number | null
          branch_id: number | null
          client_id: number | null
          created_at: string
          customer_id: number | null
          id: number
          project_id: number | null
          sub_project_id: number | null
          task_date: string | null
          task_details: string | null
          task_start_time: string | null
          task_status: number | null
          task_type_id: number | null
          total_hours: number | null
          total_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          approval_status?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at: string
          customer_id?: number | null
          id?: number
          project_id?: number | null
          sub_project_id?: number | null
          task_date?: string | null
          task_details?: string | null
          task_start_time?: string | null
          task_status?: number | null
          task_type_id?: number | null
          total_hours?: number | null
          total_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          approval_status?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          project_id?: number | null
          sub_project_id?: number | null
          task_date?: string | null
          task_details?: string | null
          task_start_time?: string | null
          task_status?: number | null
          task_type_id?: number | null
          total_hours?: number | null
          total_minutes?: number | null
          updated_at?: string | null
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
          {
            foreignKeyName: "leap_customer_project_task_approval_status_fkey"
            columns: ["approval_status"]
            isOneToOne: false
            referencedRelation: "leap_approval_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_project_task_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_project_task_task_status_fkey"
            columns: ["task_status"]
            isOneToOne: false
            referencedRelation: "leap_task_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_project_task_task_type_id_fkey"
            columns: ["task_type_id"]
            isOneToOne: false
            referencedRelation: "leap_project_task_types"
            referencedColumns: ["task_type_id"]
          },
          {
            foreignKeyName: "leap_customer_task_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "leap_client_project"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "leap_customer_task_sub_project_id_fkey"
            columns: ["sub_project_id"]
            isOneToOne: false
            referencedRelation: "leap_client_sub_projects"
            referencedColumns: ["subproject_id"]
          },
        ]
      }
      leap_customer_project_task_assignment: {
        Row: {
          assigned_by: number | null
          assigned_to: number | null
          branch_id: number | null
          client_id: number | null
          created_at: string
          deadline: string | null
          id: number
          project_id: number | null
          sub_project_id: number | null
          task_date: string | null
          task_details: string | null
          task_priority: number | null
          task_status: number | null
          task_type_id: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_by?: number | null
          assigned_to?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at: string
          deadline?: string | null
          id?: number
          project_id?: number | null
          sub_project_id?: number | null
          task_date?: string | null
          task_details?: string | null
          task_priority?: number | null
          task_status?: number | null
          task_type_id?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_by?: number | null
          assigned_to?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string
          deadline?: string | null
          id?: number
          project_id?: number | null
          sub_project_id?: number | null
          task_date?: string | null
          task_details?: string | null
          task_priority?: number | null
          task_status?: number | null
          task_type_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_customer_project_task_assignment_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_customer_project_task_assignment_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_project_task_assignment_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_project_task_assignment_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_customer_project_task_assignment_sub_project_id_fkey"
            columns: ["sub_project_id"]
            isOneToOne: false
            referencedRelation: "leap_client_sub_projects"
            referencedColumns: ["subproject_id"]
          },
          {
            foreignKeyName: "leap_customer_project_task_assignment_task_status_fkey"
            columns: ["task_status"]
            isOneToOne: false
            referencedRelation: "leap_task_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_customer_project_task_assignment_task_type_id_fkey"
            columns: ["task_type_id"]
            isOneToOne: false
            referencedRelation: "leap_project_task_types"
            referencedColumns: ["task_type_id"]
          },
          {
            foreignKeyName: "leap_customer_task_assignment_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "leap_client_project"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "leap_task_assignment_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_task_assignment_employee_id_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_task_assignment_task_priority_fkey"
            columns: ["task_priority"]
            isOneToOne: false
            referencedRelation: "leap_task_priority_level"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_dashboard_greetings: {
        Row: {
          created_at: string
          greeting_msg: string | null
          greeting_topic: string | null
          id: number
          img_url: string | null
          is_deleted: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          greeting_msg?: string | null
          greeting_topic?: string | null
          id?: number
          img_url?: string | null
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          greeting_msg?: string | null
          greeting_topic?: string | null
          id?: number
          img_url?: string | null
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_dashboard_isenable_modules: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          id: number
          is_hidden: boolean | null
          mobule_type_id: number | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          is_hidden?: boolean | null
          mobule_type_id?: number | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          is_hidden?: boolean | null
          mobule_type_id?: number | null
          updated_at?: string | null
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
      leap_dashboard_mid_shortcut: {
        Row: {
          bg_color_code: string | null
          created_at: string | null
          id: number
          navigation_url: string | null
          shortcut_icon_url: string | null
          shortcut_name: string | null
          updated_at: string | null
        }
        Insert: {
          bg_color_code?: string | null
          created_at?: string | null
          id?: number
          navigation_url?: string | null
          shortcut_icon_url?: string | null
          shortcut_name?: string | null
          updated_at?: string | null
        }
        Update: {
          bg_color_code?: string | null
          created_at?: string | null
          id?: number
          navigation_url?: string | null
          shortcut_icon_url?: string | null
          shortcut_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_dashboard_shortcuts: {
        Row: {
          color_code: string | null
          created_at: string | null
          icon: string | null
          page_url: string | null
          shortcut_id: number
          sub_title: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          icon?: string | null
          page_url?: string | null
          shortcut_id?: number
          sub_title?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          icon?: string | null
          page_url?: string | null
          shortcut_id?: number
          sub_title?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_department: {
        Row: {
          department_name: string | null
          id: number
          is_active: boolean
          updated_at: string | null
        }
        Insert: {
          department_name?: string | null
          id?: number
          is_active?: boolean
          updated_at?: string | null
        }
        Update: {
          department_name?: string | null
          id?: number
          is_active?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_designation: {
        Row: {
          department: number | null
          designation_name: string | null
          id: number
          is_deleted: boolean | null
          updated_at: string | null
        }
        Insert: {
          department?: number | null
          designation_name?: string | null
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          department?: number | null
          designation_name?: string | null
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_designation_department_fkey"
            columns: ["department"]
            isOneToOne: false
            referencedRelation: "leap_department"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_document_main_types: {
        Row: {
          created_at: string | null
          document_type: string | null
          is_deleted: boolean | null
          type_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          is_deleted?: boolean | null
          type_id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          is_deleted?: boolean | null
          type_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_document_type: {
        Row: {
          created_at: string
          document_name: string | null
          document_type_id: number | null
          id: number
          is_deleted: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          document_name?: string | null
          document_type_id?: number | null
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          document_name?: string | null
          document_type_id?: number | null
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_document_type_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "leap_document_main_types"
            referencedColumns: ["type_id"]
          },
        ]
      }
      leap_employee_bank_accounte_count: {
        Row: {
          bank_account_count_id: number
          bank_data_count: number | null
          created_at: string | null
          customer_id: number | null
          updated_at: string | null
        }
        Insert: {
          bank_account_count_id?: number
          bank_data_count?: number | null
          created_at?: string | null
          customer_id?: number | null
          updated_at?: string | null
        }
        Update: {
          bank_account_count_id?: number
          bank_data_count?: number | null
          created_at?: string | null
          customer_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_employee_bank_accounte_count_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_employee_emergency_contacts: {
        Row: {
          contact_name: string | null
          created_at: string | null
          customer_id: number | null
          emergency_contact: string | null
          id: number
          relation: number | null
          updated_at: string | null
        }
        Insert: {
          contact_name?: string | null
          created_at?: string | null
          customer_id?: number | null
          emergency_contact?: string | null
          id?: number
          relation?: number | null
          updated_at?: string | null
        }
        Update: {
          contact_name?: string | null
          created_at?: string | null
          customer_id?: number | null
          emergency_contact?: string | null
          id?: number
          relation?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_employee_emergency_contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_employee_emergency_contacts_relation_fkey"
            columns: ["relation"]
            isOneToOne: false
            referencedRelation: "leap_relations"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_employee_total_salary: {
        Row: {
          created_at: string | null
          customer_id: number | null
          gross_salary: number | null
          id: number
          net_pay: number | null
          pay_acural_days: number | null
          total_deduction: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: number | null
          gross_salary?: number | null
          id?: number
          net_pay?: number | null
          pay_acural_days?: number | null
          total_deduction?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: number | null
          gross_salary?: number | null
          id?: number
          net_pay?: number | null
          pay_acural_days?: number | null
          total_deduction?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_employee_total_salary_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_employee_total_salary_pay_acural_days_fkey"
            columns: ["pay_acural_days"]
            isOneToOne: false
            referencedRelation: "leap_salary_payable_days"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_employement_type: {
        Row: {
          created_at: string | null
          employeement_type: string | null
          employment_type_id: number
          is_deleted: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employeement_type?: string | null
          employment_type_id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employeement_type?: string | null
          employment_type_id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_holiday_list: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          date: string | null
          holiday_image: string | null
          holiday_name: string | null
          holiday_type_id: number | null
          holiday_year: number | null
          id: number
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          date?: string | null
          holiday_image?: string | null
          holiday_name?: string | null
          holiday_type_id?: number | null
          holiday_year?: number | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          date?: string | null
          holiday_image?: string | null
          holiday_name?: string | null
          holiday_type_id?: number | null
          holiday_year?: number | null
          id?: number
          updated_at?: string | null
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
          {
            foreignKeyName: "leap_holiday_list_holiday_year_fkey"
            columns: ["holiday_year"]
            isOneToOne: false
            referencedRelation: "leap_holiday_year"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_holiday_types: {
        Row: {
          created_at: string
          holiday_type: string | null
          id: number
          is_deleted: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          holiday_type?: string | null
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          holiday_type?: string | null
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_holiday_year: {
        Row: {
          client_id: number | null
          created_at: string
          description: string | null
          from_date: string | null
          id: number
          is_deleted: boolean | null
          list_name: string | null
          show_employee: boolean | null
          to_date: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          description?: string | null
          from_date?: string | null
          id?: number
          is_deleted?: boolean | null
          list_name?: string | null
          show_employee?: boolean | null
          to_date?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          description?: string | null
          from_date?: string | null
          id?: number
          is_deleted?: boolean | null
          list_name?: string | null
          show_employee?: boolean | null
          to_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_holiday_year_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_holiday_year_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
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
      leap_leave_type_icon_and_color: {
        Row: {
          bg_color: string | null
          created_at: string | null
          icon_url: string | null
          is_deleted: boolean | null
          leave_type_icon_id: number
          updated_at: string | null
        }
        Insert: {
          bg_color?: string | null
          created_at?: string | null
          icon_url?: string | null
          is_deleted?: boolean | null
          leave_type_icon_id?: number
          updated_at?: string | null
        }
        Update: {
          bg_color?: string | null
          created_at?: string | null
          icon_url?: string | null
          is_deleted?: boolean | null
          leave_type_icon_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_ocr_documents: {
        Row: {
          client_id: number | null
          created_at: string | null
          customer_id: number | null
          document_name: string | null
          document_url: string | null
          extracted_id: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          document_name?: string | null
          document_url?: string | null
          extracted_id?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          document_name?: string | null
          document_url?: string | null
          extracted_id?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_ocr_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_ocr_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_ocr_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      leap_permission_master: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean | null
          permission_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          permission_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          permission_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_project_status: {
        Row: {
          color_codes: string | null
          created_at: string | null
          is_deleted: boolean | null
          project_status_id: number
          project_status_name: string | null
          updated_at: string | null
        }
        Insert: {
          color_codes?: string | null
          created_at?: string | null
          is_deleted?: boolean | null
          project_status_id?: number
          project_status_name?: string | null
          updated_at?: string | null
        }
        Update: {
          color_codes?: string | null
          created_at?: string | null
          is_deleted?: boolean | null
          project_status_id?: number
          project_status_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_project_task_types: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          task_type_id: number
          task_type_name: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          task_type_id?: number
          task_type_name?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          task_type_id?: number
          task_type_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_project_task_types_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_project_task_types_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_project_task_types_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_project_types: {
        Row: {
          created_at: string | null
          id: number
          is_deleted: boolean | null
          project_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          project_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          project_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_projects_tech_stack: {
        Row: {
          created_at: string | null
          id: number
          is_deleted: boolean | null
          tech_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          tech_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          tech_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_push_notification_types: {
        Row: {
          created_at: string | null
          notify_type_id: number
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          notify_type_id?: number
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          notify_type_id?: number
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_push_notifications: {
        Row: {
          client_id: number | null
          created_at: string | null
          customer_id: number | null
          error_log: string | null
          is_success: number[] | null
          is_success_web: number[] | null
          message_body: string | null
          noitfy_id: number
          notify_type_id: number | null
          sent_count: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          error_log?: string | null
          is_success?: number[] | null
          is_success_web?: number[] | null
          message_body?: string | null
          noitfy_id?: number
          notify_type_id?: number | null
          sent_count?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          error_log?: string | null
          is_success?: number[] | null
          is_success_web?: number[] | null
          message_body?: string | null
          noitfy_id?: number
          notify_type_id?: number | null
          sent_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_push_notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_push_notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_push_notifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "leap_customer"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "leap_push_notifications_notify_type_id_fkey"
            columns: ["notify_type_id"]
            isOneToOne: false
            referencedRelation: "leap_client_notification_selected_types"
            referencedColumns: ["pk_id"]
          },
        ]
      }
      leap_relations: {
        Row: {
          id: number
          is_deleted: boolean | null
          relation_type: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          is_deleted?: boolean | null
          relation_type?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          is_deleted?: boolean | null
          relation_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_request_master: {
        Row: {
          category: string | null
          created_at: string
          id: number
          is_deleted: boolean | null
          type_name: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at: string
          id?: number
          is_deleted?: boolean | null
          type_name?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          type_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_request_priority: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean | null
          priority_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          priority_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          priority_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_request_status: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          id?: number
          is_deleted?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_salary_components: {
        Row: {
          created_at: string | null
          id: number
          is_basic_component: boolean | null
          is_other_component_client_id: number | null
          salary_add: boolean | null
          salary_component_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_basic_component?: boolean | null
          is_other_component_client_id?: number | null
          salary_add?: boolean | null
          salary_component_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_basic_component?: boolean | null
          is_other_component_client_id?: number | null
          salary_add?: boolean | null
          salary_component_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_salary_components_is_other_component_client_id_fkey"
            columns: ["is_other_component_client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_salary_components_is_other_component_client_id_fkey"
            columns: ["is_other_component_client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
        ]
      }
      leap_salary_payable_days: {
        Row: {
          created_at: string | null
          id: number
          is_deleted: boolean | null
          payable_time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          payable_time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          payable_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_salary_structure: {
        Row: {
          created_at: string
          id: number
          index: string
          is_deleted: boolean | null
          salary_range: string | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          id?: number
          index: string
          is_deleted?: boolean | null
          salary_range?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          index?: string
          is_deleted?: boolean | null
          salary_range?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_sector_type: {
        Row: {
          id: number
          is_deleted: boolean | null
          sector_type: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          is_deleted?: boolean | null
          sector_type: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          is_deleted?: boolean | null
          sector_type?: string
          updated_at?: string | null
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
          created_at: string
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
            referencedRelation: "leap_web_side_panel_menu"
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
      leap_show_announcement_users: {
        Row: {
          announcement_id: number | null
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          id: number
          is_active: boolean | null
          role_id: number | null
          updated_at: string | null
        }
        Insert: {
          announcement_id?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          role_id?: number | null
          updated_at?: string | null
        }
        Update: {
          announcement_id?: number | null
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          role_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leap_show_announcement_users_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "leap_client_announcements"
            referencedColumns: ["announcement_id"]
          },
          {
            foreignKeyName: "leap_show_announcement_users_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "leap_client_branch_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leap_show_announcement_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "demo_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_show_announcement_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "leap_client"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "leap_show_announcement_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "leap_user_role"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_task_priority_level: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean | null
          priority_type: string
          updated_at: string | null
        }
        Insert: {
          created_at: string
          id?: number
          is_deleted?: boolean | null
          priority_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          priority_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_task_status: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          id?: number
          is_deleted?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_time_zone: {
        Row: {
          created_at: string | null
          id: number
          time_zone: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          time_zone?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          time_zone?: string | null
        }
        Relationships: []
      }
      leap_user_activity_type: {
        Row: {
          activity_type: string | null
          created_at: string | null
          id: number
          is_deleted: boolean | null
          updated_at: string | null
        }
        Insert: {
          activity_type?: string | null
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          activity_type?: string | null
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
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
          created_at: string
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
          updated_at: string | null
          user_role_id: number | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: number | null
          email?: string | null
          id?: number
          updated_at?: string | null
          user_role_id?: number | null
          uuid?: string
        }
        Update: {
          created_at?: string | null
          customer_id?: number | null
          email?: string | null
          id?: number
          updated_at?: string | null
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
          is_deleted: boolean | null
          updated_at: string | null
          user_role: string
        }
        Insert: {
          created_at: string
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
          user_role: string
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          updated_at?: string | null
          user_role?: string
        }
        Relationships: []
      }
      leap_web_side_panel_menu: {
        Row: {
          created_at: string | null
          id: number
          is_deleted: boolean | null
          menu_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          menu_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          menu_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_web_side_panel_menu_isenabled: {
        Row: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          id: number
          isEnabled: boolean | null
          side_pannel_menu_id: number | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          isEnabled?: boolean | null
          side_pannel_menu_id?: number | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: number | null
          client_id?: number | null
          created_at?: string | null
          id?: number
          isEnabled?: boolean | null
          side_pannel_menu_id?: number | null
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
          {
            foreignKeyName: "leap_web_sidepannel_menu_isenabled_side_pannel_menu_id_fkey"
            columns: ["side_pannel_menu_id"]
            isOneToOne: false
            referencedRelation: "leap_web_side_panel_menu"
            referencedColumns: ["id"]
          },
        ]
      }
      leap_working_type: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          id?: number
          is_deleted?: boolean | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leap_yearly_leave: {
        Row: {
          client_id: number | null
          created_at: string
          customer_id: number | null
          id: number
          leave_id: number | null
          total_leave_left: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at: string
          customer_id?: number | null
          id?: number
          leave_id?: number | null
          total_leave_left?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          leave_id?: number | null
          total_leave_left?: number | null
          updated_at?: string | null
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
          {
            foreignKeyName: "leap_yearly_leave_leave_id_fkey"
            columns: ["leave_id"]
            isOneToOne: false
            referencedRelation: "leap_client_leave"
            referencedColumns: ["leave_id"]
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
        Args: { client_id_param: number }
        Returns: {
          client_id: number
          hasexpirydays: number
          is_paid: boolean
          iscarryforward: boolean
          leave_type_id: number
          num_of_days: number
          totaldaysperyear: number
          type: string
        }[]
      }
      get_client_holiday_list: {
        Args: { branch_id: number; client_id: number; target_year: number }
        Returns: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          date: string | null
          holiday_image: string | null
          holiday_name: string | null
          holiday_type_id: number | null
          holiday_year: number | null
          id: number
          updated_at: string | null
        }[]
      }
      get_client_holiday_list1: {
        Args: { branch_id: number; client_id: number; target_year: number }
        Returns: {
          branch_id: number | null
          client_id: number | null
          created_at: string | null
          date: string | null
          holiday_image: string | null
          holiday_name: string | null
          holiday_type_id: number | null
          holiday_year: number | null
          id: number
          updated_at: string | null
        }[]
      }
      get_customers_by_designation: {
        Args: { branch_id: number; customer_id: number }
        Returns: {
          customers: Json
          designation_name: string
          id: number
        }[]
      }
    }
    Enums: {
      address_type: "current" | "permanent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      address_type: ["current", "permanent"],
    },
  },
} as const
