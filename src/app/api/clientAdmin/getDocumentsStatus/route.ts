import { NextRequest, NextResponse } from "next/server";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
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

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const { data: documents, error } = await supabase.from("leap_client_documents")
      .select(`*`)
      .eq('client_id', formData.get('client_id'))
      .eq('branch_id', formData.get('branch_id'))
      .gte('till_date', oneMonthAgo.toISOString().split('T')[0])

    if (error) {
      return funSendApiErrorMessage(error, "Failed To Fetch Documents");
    }
    else {
      return NextResponse.json({ status: 1, message: "Documents Validity", data: documents },
        { status: apiStatusSuccessCode });
    }



  } catch (error) {


    return funSendApiException(error);

  }
}