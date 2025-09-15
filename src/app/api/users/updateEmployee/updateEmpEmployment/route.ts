import { NextRequest, NextResponse } from "next/server";
import supabase from "../../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong, authEmailfailure, personaldetailsfailure, personaldetailsSuccess, updateEmployementFailure, updateEmployementSuccess } from "@/app/pro_utils/stringConstants";
import { funSendApiException } from "@/app/pro_utils/constant";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {

  try {
    // const { data: user, error: userError } = await supabase.auth.getUser();


    // // Handle case where the user is not authenticated
    // if (userError || !user) {
    //   return NextResponse.json(
    //     { message:"User auth not found", error: 'User not authenticated' },
    //     { status: 401 }
    //   );
    // }
    const formData = await request.formData();
    const fdata = {

      clientID: formData.get('client_id'),
      customerId: formData.get('customer_id'),
      role_id: formData.get('role_id') as string,
      designation_id: formData.get('designation_id'),
      department_id: formData.get('department_id'),
      manager_id: formData.get('manager_id'),
      employment_type: formData.get('employment_type'),
      branch_id: formData.get('branch_id'),
      work_mode: formData.get('work_mode'),
      work_location: formData.get('work_location'),
      date_of_joining: formData.get('date_of_joining'),
      email_id: formData.get('email_id'),
      authUuid: formData.get('authUuid') as string,

    }



    let authQuery;

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SERVICE_ROLE_SUPABASE_KEY!;
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    if (parseInt(fdata.role_id) == 2) {
      console.log('if condition called ');

      authQuery = supabaseAdmin.auth.admin.updateUserById(
        fdata.authUuid,
        { email: formData.get('official_email') as string }
      )
    } else {
      authQuery = supabase.auth.updateUser({ email: formData.get('official_email') as string });

    }
    const { data: user, error } = await authQuery;
    if (error) {
      console.log(error);

      return NextResponse.json({ message: authEmailfailure, error: error },
        { status: apiStatusFailureCode });

    }

    let query = supabase
      .from("leap_customer")
      .update({
        email_id: fdata.email_id,
        designation_id: fdata.designation_id,
        department_id: fdata.department_id,
        manager_id: fdata.manager_id,
        branch_id: fdata.branch_id,
        date_of_joining: fdata.date_of_joining,
        employment_type: fdata.employment_type,
        work_location: fdata.work_location,
        work_mode: fdata.work_mode,

      }).eq('customer_id', fdata.customerId);



    const { error: clientError } = await query;

    if (clientError) {
      console.log(clientError);

      return NextResponse.json({ message: updateEmployementFailure, error: clientError },
        { status: apiStatusFailureCode });

    }
    (async () => {

      try {
        const { data: shouldNotify, error } = await supabase.from("leap_client_notification_selected_types").select("*").eq("selected_notify_type_id", 8);
        if (shouldNotify && shouldNotify.length === 0) {
          const formData = new FormData();
          formData.append("customer_id", String(fdata.customerId));
          formData.append("title", "Employment Details Updated");
          formData.append("notify_type", "8");// its 8 for profile related updates in leap_push_notification_types table
          formData.append("message", "Your employement details has been updated.");
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
            method: "POST",
            body: formData
          });
        }
      } catch (err) {
        console.log(err);
      }

    })();

    return NextResponse.json({ message: updateEmployementSuccess, status: 1 }
    );



  } catch (error) {
    console.log(error);

    return funSendApiException(error);

  }
}