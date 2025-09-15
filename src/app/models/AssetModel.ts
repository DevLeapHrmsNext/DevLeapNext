export interface AssetModel {
  message: string
  assetList: AssetList[]
}
export interface AssetList {
  asset_id: number
  purchased_at: string
  asset_name: string
  asset_pic: File[] | []
  asset_status: string
  device_code: string
  created_at: string
  updated_at: string
  client_id: string
  branch_id: string
  is_deleted: boolean
  asset_type: string
  condition: string
  remark: any
  warranty_date: string
  configuration: string
  vendor_bill: File | null
  leap_asset_type: LeapAssetType
  leap_asset_status: LeapAssetStatus
  leap_customer_asset: LeapCustomerAsset[]
  leap_asset_condition: LeapAssetCondition

}

export interface LeapAssetType {
  asset_type: string
}

export interface LeapAssetStatus {
  id: string
  status: string
  created_at: string
}

export interface LeapCustomerAsset {
  date_given: string
  customer_id: string
  leap_customer: LeapCustomer
}

export interface LeapCustomer {
  name: string
}

export interface LeapAssetCondition {
  id: string
  condition: string
}

export interface AssignModel {
  message: string
  data: AssignAsset[]
}
export interface AssignAsset {
  id: number
  date_given: string
  asset_id: number
  customer_id: number
  date_of_return: any
  assigned_duration: any
  is_active: boolean
  client_id: number
  branch_id: number
  remark: string
  asset_pic: any
}
export interface AssetTypeModel {
  message: string
  data: AssetType[]
}
export interface AssetType {
  id: number
  created_at: string
  asset_type: string
}


export interface CustomerAsset {
  status: number
  message: string
  assetList: CustomerAssetList[]
}

export interface CustomerAssetList {
  id: number
  date_given: string
  asset_id: number
  customer_id: number
  date_of_return: any
  assigned_duration: any
  is_active: boolean
  client_id: string
  branch_id: string
  remark: any
  asset_pic: []
  leap_asset: LeapAsset
}

export interface LeapAsset {
  remark: string
  asset_id: number
  asset_pic: any
  branch_id: number
  client_id: number
  condition: number
  asset_name: string
  asset_type: number
  created_at: string
  is_deleted: boolean
  updated_at: string
  device_code: string
  vendor_bill: any
  asset_status: number
  purchased_at: string
  configuration: string
  warranty_date: string
  leap_asset_type: LeapAssetType
}


export interface LeapAssetType {
  id: number
  client_id: number
  asset_type: string
  created_at: string
  is_deleted: boolean
}