import { NextRequest, NextResponse } from "next/server";
import supabase from "../../../supabaseConfig/supabase";
import { encodeData, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { apiStatusInvalidDataCode, apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const fdata = {
            customer_id:formData.get('customer_id') ,
            client_id: formData.get('client_id'),
            branch_id: formData.get('branch_id'),
            bank_name: formData.get('bank_name'),
            account_number: formData.get('account_number'),
            IFSC_code: formData.get('IFSC_code'),
            UAN_number: formData.get('UAN_number'),
            ESIC_number: formData.get('ESIC_number'),
            PAN_number: formData.get('PAN_number'),
            TIN_number: formData.get('TIN_number'),
            security_insurance_no: formData.get('security_insurance_no'),
            address: formData.get('address') as string,
            emergencyCName: formData.get('emergency_contact_name'),
            emergencyCMobNumber: formData.get('emergency_contact_number'),
            emergencyCRelatio: formData.get('emergency_contact_relation_id'),
          }
          
        // return NextResponse.json({ status: 1, message: "Customer inserted successfully", data: "BANK DETAILS" }, { status: apiStatusSuccessCode })
        
        let query = supabase.from('leap_customer_bank_details').insert([
            {   
                customer_id:fdata.customer_id,
                client_id:fdata.client_id,
                bank_name:fdata.bank_name,
                account_number:encodeData(fdata.account_number),
                IFSC_code:fdata.IFSC_code,
                UAN_number:fdata.UAN_number,
                ESIC_number:fdata.ESIC_number,
                PAN_number:fdata.PAN_number,
                TIN_number:fdata.TIN_number,
                security_insurance_no:fdata.security_insurance_no,
                created_at: new Date()
            }
        ]);
        const { error: insertBankError } = await query;
        
        if (insertBankError) {
            return funSendApiErrorMessage(insertBankError, "Insert Bank Details Issue" )
        }
        // console.log(query);
        const addressData = JSON.parse(fdata.address);
        if (addressData == null) {
                    return NextResponse.json({ status: 1, message: "Address json is not properly formated" }, { status: apiStatusInvalidDataCode })
                }
        
                let current_latlng: any[] = [];
                if (addressData.current.latlng.includes(",")) {
                    current_latlng = addressData.current.latlng.split(",")
                }
        
                let permanent_latlng: any[] = [];
                if (addressData.permanent.latlng.includes(",")) {
                    permanent_latlng = addressData.current.latlng.split(",")
                }

        

        let currentAddress = supabase.from('leap_customer_address').insert([
            {
                client_id: fdata.client_id,
                branch_id: fdata.branch_id,
                customer_id: fdata.customer_id,
                address_line1: addressData.current.address_line_1,
                address_line2: addressData.current.address_line_2,
                city: addressData.current.city,
                state: addressData.current.state,
                postal_code: addressData.current.zip,
                country: addressData.current.country,
                latitude: current_latlng.length > 0 ? current_latlng[0] : null,
                longitude: current_latlng.length > 0 ? current_latlng[1] : null,
                is_primary: false,
                created_at: new Date()


            }
        ])

        const { error: insertCurrentError } = await currentAddress;
        if (insertCurrentError) {
            return NextResponse.json({ message: "Insert Customer Issue", error: insertCurrentError })
        }
        let permanentAddress = supabase.from('leap_customer_address').insert([
            {
                client_id: fdata.client_id,
                branch_id: fdata.branch_id,
                customer_id: fdata.customer_id,
                address_line1: addressData.permanent.address_line_1,
                address_line2: addressData.permanent.address_line_2,
                city: addressData.permanent.city,
                state: addressData.permanent.state,
                postal_code: addressData.permanent.zip,
                country: addressData.permanent.country,
                latitude: permanent_latlng.length > 0 ? permanent_latlng[0] : null,
                longitude: permanent_latlng.length > 0 ? permanent_latlng[1] : null,
                is_primary: true,
                created_at: new Date()


            }
        ])
        const { error: insertPermanentError } = await permanentAddress;


        if (insertPermanentError) {
            return NextResponse.json({ message: "Insert Customer Issue", error: insertPermanentError })
        }

        let updateEmergencyContact = supabase.from('leap_customer').update([
            {
                emergency_contact: fdata.emergencyCMobNumber,
                contact_name: fdata.emergencyCName,
                relation: fdata.emergencyCRelatio,
            }
        ]).eq('customer_id', fdata.customer_id)

        const { data: updateEmerContact, error: updateEContacterror } = await updateEmergencyContact;

        if (updateEContacterror) {
            return funSendApiErrorMessage( updateEContacterror,"Insert Customer Issue" )
        }
        return NextResponse.json({ status: 1, message: "Data inserted successfully" }, { status: apiStatusSuccessCode })

        

    } catch (error) {
        console.log(error);
        return funSendApiException(error);
    }

}


