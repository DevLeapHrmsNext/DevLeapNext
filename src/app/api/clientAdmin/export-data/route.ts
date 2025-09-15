import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import supabase from "../../supabaseConfig/supabase";
import { dashedDateYYYYMMDD, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { exportTypeAsset, exportTypeBirthdays, exportTypeHoliday, exportTypeLeave } from "@/app/pro_utils/stringConstants";
import { LeaveData } from "@/app/models/leaveModel";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const clientid = formData.get('client_id');
        const exportType = formData.get('export_type');
        // Fetch data from Supabase
        if (exportType == exportTypeHoliday) {
            const yearID = formData.get('yearID');
            const branch_id = formData.get('branch_id');
            return exportHolidayList(clientid,yearID,branch_id);
        } else if (exportType == exportTypeBirthdays) {
            return exportBirthdayList(clientid);
        }else if (exportType == exportTypeAsset) {
            return exportAssetList(clientid);
        }else if (exportType == exportTypeLeave) {
            return exportLeaveList(clientid,formData.get("start_date"),formData.get("end_date"));
        }
    } catch (err) {
        console.log("Error in export_data route:", err);
        
        return funSendApiException(err)
    }
}


async function exportHolidayList(clientID: any,yearID:any,branch_id:any) {
    console.log("exportHolidayList is called with clientID:", clientID);
    let queryBuilder = supabase.from("leap_holiday_list")
        .select("holiday_name,date,leap_holiday_types(holiday_type),leap_client_branch_details(id,branch_number)")
        .eq("client_id", clientID);

    if (branch_id) {
        queryBuilder = queryBuilder.eq('branch_id', branch_id);
    }
    if (yearID ) {
            queryBuilder = queryBuilder.eq('holiday_year', yearID);
        }

    const { data, error } = await queryBuilder as unknown as { data: ExportHolidaysParse[]; error: any };
    if (error) {
        return funSendApiErrorMessage(error, "Unable to extract data");
    }
    // {
    //     holiday_name: 'tetst23',
    //     date: '2025-12-12',
    //     leap_holiday_types: { holiday_type: 'National Holiday' },
    //     leap_client_branch_details: { id: 18, branch_number: '5' }
    //   }
    const flatData = data.map((item, index) => ({
        Branch_ID:item.leap_client_branch_details.id,
        Name:item.holiday_name,
        date:item.date
        
      }));
      
      
    // Convert data to CSV
    const csv = Papa.unparse(flatData);

    // Create response with headers
    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="holidays.csv"',
        },
    });
}
async function exportBirthdayList(clientID: any) {
    const { data, error } = await supabase.from("leap_all_birthdays")
        .select("ocassion,ocassion_date,leap_customer(emp_id,name)")
        .eq("client_id", clientID)as unknown as { data: ExportBirthdays[]; error: any };

    if (error) {
        return funSendApiErrorMessage(error, "Unable to extract data");
    }

    // {
    //     ocassion: 'Work Anniversary',
    //     ocassion_date: '2025-04-04',
    //     leap_customer: { name: 'oldusername', emp_id: 'E323' }
    //   }
    const flatData = data.map((item, index) => ({
        employee_name: item.leap_customer.name,
        ocassion:item.ocassion,
        date:item.ocassion_date
        
      }));
    // Convert data to CSV
    const csv = Papa.unparse(flatData);

    // Create response with headers
    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="data.csv"',
        },
    });
}

async function exportAssetList(clientID: any) {
    let query = supabase.from("leap_asset")
        .select("*,leap_asset_type(asset_type),leap_asset_status(status),leap_asset_condition(condition),leap_customer_asset(leap_customer(emp_id,name))")
        .eq("client_id", clientID);

        

    const { data, error } = await query;

    
    if (error) {
        return funSendApiErrorMessage(error, "Unable to extract data");
    }
    console.log(data);
    
    const flatData = data.map((item, index) => ({
        Sr_no: index + 1,
        purchased_at: item.purchased_at,
        asset_name: item.asset_name,
        asset_pic: item.asset_pic,
        asset_status: item.asset_status,
        device_code: item.device_code,
        client_id: item.client_id,
        branch_id: item.branch_id,
        is_deleted: item.is_deleted,
        asset_type: item.asset_type,
        condition: item.condition,
        remark: item.remark || "N/A",
        warranty_date: item.warranty_date,
        configuration: item.configuration || "N/A",
        vendor_bill: item.vendor_bill || "N/A",
        leap_asset_type: item.leap_asset_type?.asset_type || "N/A",
        leap_asset_status: item.leap_asset_status?.status || "N/A",
        leap_asset_condition: item.leap_asset_condition?.condition || "N/A",
        leap_customer_emp_id: item.leap_customer_asset[0]?.leap_customer?.emp_id || "N/A",
        leap_customer_name: item.leap_customer_asset[0]?.leap_customer?.name || "N/A",
    }));
    // Convert data to CSV
    const csv = Papa.unparse(flatData);

    // Create response with headers
    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="data.csv"',
        },
    });
} 

async function exportLeaveList(clientID: any,start_date:any,end_date:any) {
    let query = supabase.from("leap_customer_apply_leave")
        .select("*,leap_client_leave(leave_name,leave_category,leave_count,leave_accrual,gender,user_role_applicable,if_unused,validPeriod),leap_customer(emp_id,name)")
        .eq("client_id", clientID);

    if(start_date){
        query=query.gte("from_date",start_date)
    }else if(start_date && end_date){
        query=query.gte("from_date",dashedDateYYYYMMDD( start_date)).lte("from_date",dashedDateYYYYMMDD(end_date));
    }

    const { data, error } = await query;
    
    if (error) {
        return funSendApiErrorMessage(error, "Unable to extract data");
    }

    
    console.log(data);

    
    const flatData = data.map((item, index) => ({
        Sr_no: index + 1,
        employee_id: item?.leap_customer?.emp_id || "N/A",
        employee_name: item?.leap_customer?.name || "N/A",
        from_date: item?.from_date || "N/A",
        to_date: item?.to_date || "N/A",
        total_days: item?.total_days || 0,
        leave_status: item?.leave_status || "N/A",
        approve_disapprove_remark: item?.approve_disapprove_remark || "N/A",
      
        // Flatten leap_client_leave fields
        leave_name: item?.leap_client_leave?.leave_name || "N/A",
        leave_count: item?.leap_client_leave?.leave_count || 0,
        leave_category: item?.leap_client_leave?.leave_category || "N/A",
        leave_accrual: item?.leap_client_leave?.leave_accrual || "N/A",
        valid_period: item?.leap_client_leave?.validPeriod || "N/A",
        gender: item?.leap_client_leave?.gender || "N/A",
        if_unused: item?.leap_client_leave?.if_unused || "N/A",
        user_role_applicable: item?.leap_client_leave?.user_role_applicable || "N/A",
      
        // Flatten leap_customer fields
        
      }));
    
    // Convert data to CSV
    const csv = Papa.unparse(flatData);

    // Create response with headers
    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="data.csv"',
        },
    });
} 

