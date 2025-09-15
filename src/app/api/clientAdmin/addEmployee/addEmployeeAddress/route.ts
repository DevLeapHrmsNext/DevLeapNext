import { NextRequest, NextResponse } from "next/server";
import supabase from "../../../supabaseConfig/supabase";
import { addDays, addMonthsToDate, dashedDateYYYYMMDD, findLastAlphabet, funSendApiErrorMessage, funSendApiException, incrementNumbersInString, parseForm, } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { apiStatusInvalidDataCode, apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { log } from "console";


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const fdata = {
            client_id: formData.get('client_id'),
            branch_id: formData.get('branch_id'),
            customer_id: formData.get('customer_id'),
            address: formData.get('address') as string,
            emergencyCName: formData.get('emergency_contact_name'),
            emergencyCMobNumber: formData.get('emergency_contact_number'),
            emergencyCRelatio: formData.get('emergency_contact_relation_id'),

        }
        const addressData = JSON.parse(fdata.address)
        console.log(addressData);

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

        const { data: insertCurrent, error: insertCurrentError } = await currentAddress;
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
        const { data: insertPermanent, error: insertPermanentError } = await permanentAddress;


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
        return NextResponse.json({ status: 1, message: "Address inserted successfully" }, { status: apiStatusSuccessCode })

    } catch (error) {
        console.log(error);
        return funSendApiException(error);
    }

}


