import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { calculateNumMonths, funISDataKeyPresent, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException, getFirstDateOfYearbyDate } from "@/app/pro_utils/constant";
import { isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";

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
    const { client_id, branch_id, customer_id, platform, version, auth_token, id } = await request.json();


    if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
      return funloggedInAnotherDevice()
    }
    let query = supabase
      .from('leap_document_type')
      .select('document_name, document_type_id, is_deleted,leap_customer_documents(isEnabled, bucket_url, customer_id, doc_type_id )')
      .or(`document_type_id.eq.2,document_type_id.eq.5`)
      .eq('is_deleted', false)
      .eq('leap_customer_documents.customer_id', customer_id)
      .eq('leap_customer_documents.isEnabled', true)

    if (funISDataKeyPresent(id)) {
      query = query.eq('id', id)
    }

    const { data, error } = await query;
    if (error) {
      return funSendApiErrorMessage(error, "Unable to get Documents")
    }
    else {
      const filteredData = data.filter(item =>
        item.leap_customer_documents && item.leap_customer_documents.length > 0
      );
      const type2Docs: any = [];
      const type5Docs: any = [];

      filteredData.forEach(item => {
        const docsWithType = item.leap_customer_documents.map((doc: { bucket_url: string; }) => {
          const fileUrl = doc.bucket_url || "";
          const extension = fileUrl.includes(".")
            ? fileUrl.split(".").pop()?.toLowerCase()
            : null;

          return {
            ...doc,
            doc_type: extension, 
          };
        });

        const updatedItem = {
          ...item,
          leap_customer_documents: docsWithType,
        };
        if (item.document_type_id === 2) {
          type2Docs.push(updatedItem);
        } else if (item.document_type_id === 5) {
          type5Docs.push(updatedItem);
        }
      });

      return NextResponse.json({
        message: "All Documents",
        status: 1,
        organization_specific: type2Docs,
        employee_personal: type5Docs
      }, { status: apiStatusSuccessCode })
    }

  } catch (error) {
    return funSendApiException(error);

  }
}