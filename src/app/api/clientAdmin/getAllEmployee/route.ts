import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";


export async function POST(request: NextRequest) {

    try {
        // const { data: user, error: userError } = await supabase.auth.getUser();

        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const formData = await request.formData();
        const fdata = {

            clientID: formData.get('client_id'),
            branchID: formData.get('branch_id'),
            departmentID: formData.get('department_id'),
            designationID: formData.get('designation_id'),
            sortOrder: formData.get("sortOrder"),
            customer_id: formData.get("customer_id"),
            
        };
        // console.log(fdata);
        

        let query= supabase.from("leap_customer")
            .select(`*,leap_client_designations(*),leap_client_departments(*)`)
            .eq('client_id', fdata.clientID).not('user_role', 'eq', 2);
        
        // filter
        if (fdata.branchID) {
            query = query.eq("branch_id", fdata.branchID);
        }
        if (fdata.departmentID) {
            query = query.eq("department_id", fdata.departmentID);
        }
        if (fdata.designationID) {
            query = query.eq("designation_id", fdata.designationID);
        }
        if (fdata.customer_id) {
            query = query.eq("customer_id", fdata.customer_id);
        }
        
        
        
        if (fdata.sortOrder && fdata.sortOrder=="1") {
            query = query.order('name', { ascending: true });
        }
        else if (fdata.sortOrder && fdata.sortOrder=="2") {
            query = query.order('name', { ascending: false });
        }
        
        // need to call filtered data 
         console.log(query);
         
        const { data: customer, error } = await query;
        
        if (error) {
            return funSendApiErrorMessage(error, "Unable to fetch users");
        }

        // let sortedData = customer;
        // if (fdata.sortOrder === "A-Z") {
        //     sortedData = customer.sort((a, b) => (a.name > b.name ? 1 : -1));
        // } else if (fdata.sortOrder === "Z-A") {
        //     sortedData = customer.sort((a, b) => (a.name < b.name ? 1 : -1));
        // }
        
    
            return NextResponse.json({ status: 1, message: " All Users", data: customer }, { status: apiStatusSuccessCode })
        ;

    } catch (error) {


        return funSendApiException(error);

    }

}


