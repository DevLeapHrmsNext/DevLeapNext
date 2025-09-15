import { NextRequest, NextResponse } from "next/server";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong, updateAdrressFailure, updateAdrressSuccess } from "@/app/pro_utils/stringConstants";
import { funSendApiException } from "@/app/pro_utils/constant";
import supabase from "@/app/api/supabaseConfig/supabase";

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


      customerId: formData.get('customer_id'),
      role_id: formData.get('role_id') as string,
      current_id: formData.get('current_id'),
      c_address_line1: formData.get('c_address_line1'),
      c_address_line2: formData.get('c_address_line2'),
      c_city: formData.get('c_city'),
      c_state: formData.get('c_state'),
      c_postal_code: formData.get('c_postal_code'),
      c_country: formData.get('c_country'),

      permenant_id: formData.get('permenant_id'),
      p_address_line1: formData.get('p_address_line1'),
      p_address_line2: formData.get('p_address_line2'),
      p_city: formData.get('p_city'),
      p_state: formData.get('p_state'),
      p_postal_code: formData.get('p_postal_code'),
      p_country: formData.get('p_country'),

      emergency_contact: formData.get('emergency_contact'),
      contact_name: formData.get('contact_name'),
      relation: formData.get('relation'),



    }
    if (fdata.current_id && fdata.current_id.toString().length > 0) {
      let query = supabase
        .from("leap_customer_address")
        .update({
          address_line1: fdata.c_address_line1,
          address_line2: fdata.c_address_line2,
          city: fdata.c_city,
          state: fdata.c_state,
          postal_code: fdata.c_postal_code,
          country: fdata.c_country,

        }).eq('id', fdata.current_id);



      const { error: clientError } = await query;
      if (clientError) {
        console.log(clientError);

        return NextResponse.json({ message: updateAdrressFailure, error: clientError },
          { status: apiStatusFailureCode });

      }

    }
    if (fdata.permenant_id && fdata.permenant_id.toString().length > 0) {
      let query = supabase
        .from("leap_customer_address")
        .update({
          address_line1: fdata.p_address_line1,
          address_line2: fdata.p_address_line2,
          city: fdata.p_city,
          state: fdata.p_state,
          postal_code: fdata.p_postal_code,
          country: fdata.p_country,

        }).eq('id', fdata.permenant_id);



      const { error: clientError } = await query;
      if (clientError) {
        console.log(clientError);

        return NextResponse.json({ message: updateAdrressFailure, error: clientError },
          { status: apiStatusFailureCode });

      }


    }
    let eContactUpQuery = supabase
        .from("leap_customer")
        .update({
          
          emergency_contact:fdata.emergency_contact,
          contact_name:fdata.contact_name,
          relation:fdata.relation,
        }).eq('customer_id', fdata.customerId);
        const { error } = await eContactUpQuery;
        if (error) {
          console.log(error);
  
          return NextResponse.json({ message: updateAdrressFailure, error: error },
            { status: apiStatusFailureCode });
  
        }
    return NextResponse.json({ message: updateAdrressSuccess, status: 1 }
    );


  } catch (error) {
    return funSendApiException(error);

  }
}