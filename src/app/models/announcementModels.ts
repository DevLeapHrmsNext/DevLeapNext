
interface AnnouncementFormValues {
    branchID: AnnouncementBranchID[],
    announceTypeID: any,
    roleTypes: AnnouncementRoleTypesID[],
    title: any,
    image: File | any,
    description: any,
    announcementDate: any,

    startDate: any,
    endDate: any,
    hasValidity:any,
    enabled: any,

}
interface AnnouncementBranchID{
    id:any,
    branch_name:any,
    isSelected:boolean
}
interface AnnouncementRoleTypesID{
    id:any,
    role_types:any,
    isSelected:boolean
}

interface AnnouncementValues {
  branchID: any,
  announceTypeID: any,
  roleTypes: any,
  title: any,
  image: File | any,
  description: any,
  announcementDate: any,
  startDate: any,
  endDate: any,
  showAll: any,
  enabled: any,

}

interface AnnouncementData {
    announcement_id: any
    client_id: any
    branch_id: any
    announcement_title: string
    announcement_details: string
    announcement_type_id: any
    announcement_image: string
    announcement_date: string
    send_on_date: string
    validity_date: string
    isEnabled: boolean
    newImage:File|null
    leap_show_announcement_users: LeapShowAnnouncementUser[]
  }


  interface LeapShowAnnouncementUser {
    id: number
    role_id: number
    branch_id: number
    client_id: number
    created_at: string
    updated_at: string
    announcement_id: number
  }

  interface AnnouncementList{
    announcement_id: number
    client_id: number
    branch_id: number
    announcement_title: string
    announcement_details: string
    announcement_type_id: number
    announcement_image: string
    announcement_date: string
    send_on_date: string
    num_of_days: number
    created_at: string
    updated_at: string
    validity_date: string
    isEnabled: boolean
    send_to_all: boolean
    leap_show_announcement_users: LeapShowAnnouncementUser[]
}
interface LeapShowAnnouncementUser {
    role_id: number
    announcement_id: number
  }


 interface AnnouncementModel {
  status: number
  message: string
  data: Announcement[]
}

 interface Announcement {
  leap_client_announcements: LeapClientAnnouncements
}

 interface LeapClientAnnouncements {
  branch_id: number
  client_id: number
  isDeleted: boolean
  isEnabled: boolean
  created_at: string
  updated_at: string
  num_of_days?: number
  send_to_all: boolean
  send_on_date: string
  validity_date?: string
  announcement_id: number
  announcement_date: string
  announcement_image: string
  announcement_title: string
  announcement_details: string
  announcement_type_id: number
}