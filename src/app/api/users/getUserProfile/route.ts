import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funSendApiException } from "@/app/pro_utils/constant";

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
        const { client_id, branch_id, customer_id } = await request.json();

        let query = supabase
            .from("leap_customer")
            .select(`name, emp_id, contact_number, email_id, profile_pic, designation_id(designation_name),blood_group,emergency_contact, contact_name, relation(relation_type)`)
            .eq('client_id', client_id)
            .eq('customer_id', customer_id);

        const { data: customerProfile, error: clientError } = await query;
        if (clientError) {
            return NextResponse.json({ message: apiwentWrong, error: clientError },
                { status: apiStatusFailureCode });
        }

        let address = supabase
            .from("leap_customer_address")
            .select('address_line1, address_line2, city, state, postal_code, country, address_type')
            .eq('client_id', client_id)
            .eq('customer_id', customer_id);

        const { data: customerAddress, error: addressError } = await address;
        if (addressError) {
            return NextResponse.json({ message: apiwentWrong, error: addressError },
                { status: apiStatusFailureCode });
        }

        if (customerProfile) {
            const currentAddress = customerAddress.filter(addr => addr.address_type === "current");
            const permanentAddress = customerAddress.filter(addr => addr.address_type === "permanent");

            return NextResponse.json({
                message: allClientsData,
                status: 1,
                data: {
                    customerProfile,
                    currentAddress,
                    permanentAddress
                }
            }, { status: apiStatusSuccessCode });
        }

    } catch (error) {
        return funSendApiException(error);
    }
}