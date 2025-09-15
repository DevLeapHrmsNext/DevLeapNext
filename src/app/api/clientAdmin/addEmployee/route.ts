import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { findLastAlphabet, funSendApiErrorMessage, funSendApiException, incrementNumbersInString, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { apiStatusFailureCode, apiStatusInvalidDataCode, apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { log } from "console";


export async function POST(request: NextRequest) {
    let newEmpID = "";
    try {
        const { fields, files } = await parseForm(request);

        // if (!files || !files.file) {
        //     return NextResponse.json({ error: "No files received." }, { status: 400 });
        // }

        // const ocrDocs = JSON.parse(fields.ocr_details[0]);
        // let ocrDocsError=false;
        // for (let i = 0; i < ocrDocs.length; i++) {
        //     console.log(ocrDocs[i]);
            
        //     let addEmergencyContact = supabase.from('leap_ocr_documents').insert([
        //         {
        //             client_id:fields.client_id[0],
        //             customer_id: 3,
        //             extracted_id: ocrDocs[i].document_extracted_id,
        //             document_url: ocrDocs[i].document_url,
        //             document_name: ocrDocs[i].document_name,
        //             created_at: new Date(),
        //         }
        //     ])
        //     const { error: insertOcrDocsError } = await addEmergencyContact;
        //     if(insertOcrDocsError){
        //         console.log(insertOcrDocsError);
        //         ocrDocsError=true;
        //     }

        // }
        // return funSendApiErrorMessage("api is called","No error just for testing the data passed to api");
        const { data: lastCustomerEmpID, error: custError } = await supabase.from('leap_customer')
            .select('emp_id')
            .eq('client_id', fields.client_id[0])
            .order('emp_id', { ascending: false }).limit(1);
        console.log("fetch customer error", custError);

        if (custError) {

            return NextResponse.json({ message: "Customer fetch Issue", error: custError })
        }
        

        console.log("lastCustomerEmpID", fields.email_id[0]);
        console.log("lastCustomerEmpID", fields.password[0]);
        
        const emailPassword = {
            email: fields.email_id[0],
            password: fields.password[0],
        }
        console.log(emailPassword);
        
        let signedUserData;
        const { data: signUpData, error } = await supabase.auth.signUp(emailPassword);
        console.log("signup error", error);
        if (error) {
            if (error.code != "user_already_exists") {
                return NextResponse.json({ status: 0, error: error.message }, { status: 401 });
            } else {
                const email = fields.email_id[0], password = fields.password[0];
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) {
                    return NextResponse.json({ status: 0, error: error.message }, { status: 200 });

                } else {
                    signedUserData = data;
                }
            }
        } else {
            signedUserData = signUpData;
        }
        console.log("lastCustomerEmpID[0].emp_id", lastCustomerEmpID[0].emp_id);
        
        let query = supabase.from('leap_customer').insert([
            {
                client_id: fields.client_id[0],
                branch_id: fields.branch_id[0] || null,
                name: fields.name[0] || null,
                profile_pic: "", //fileUploadResponse.documentURL,
                dob: fields.dob[0] || null,
                gender: fields.gender[0] || null,
                marital_status: fields.marital_status[0] || null,
                nationality: fields.nationality[0] || null,
                blood_group: fields.blood_group[0] || null,
                contact_number: fields.contact_number[0] || null,
                email_id: fields.email_id[0] || null,
                personalEmail: fields.p_email_id ? fields.p_email_id[0] : null,
                user_role: 5,
                authUuid: signedUserData.user!.id,
                emp_id: incrementNumbersInString(lastCustomerEmpID[0].emp_id),
                created_at: new Date(),

            }
        ]).select()
        // console.log(query);


        const { data: insertCustomer, error: insertCustError } = await query;
        if (insertCustError) {
            return NextResponse.json({ message: "Insert Customer Issue", error: insertCustError, status: apiStatusFailureCode })
        }
        const { data: insertBirthday, error: insertBitdayError } = await supabase.from("leap_all_birthdays")
            .insert({
                client_id: insertCustomer[0].client_id,
                customer_id: insertCustomer[0].customer_id,
                ocassion: "Birthday",
                ocassion_date: insertCustomer[0].dob,
                is_enabled: true,
                created_at: new Date()
            });
    
        
        const fdata = {

            address: fields.address_details[0],
            bank_name: fields.bank_details_array[0],
            emergencyContactData: fields.emergency_contact_details_array[0],
            ocr_details: fields.ocr_details[0],

        }

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
            permanent_latlng = addressData.permanent.latlng.split(",")
        }
        let currentAddress = supabase.from('leap_customer_address').insert([
            {
                client_id: insertCustomer[0].client_id,
                customer_id: insertCustomer[0].customer_id,
                address_line1: addressData.current.currentAddressLineOne,
                address_line2: addressData.current.currentAddressLineTwo,
                city: addressData.current.currentCity,
                state: addressData.current.currentState,
                postal_code: addressData.current.currentPostalCode,
                country: addressData.current.currentCountry,
                latitude: current_latlng.length > 0 ? current_latlng[0] : null,
                longitude: current_latlng.length > 0 ? current_latlng[1] : null,
                is_primary: true,
                address_type:"current",
                created_at: new Date()


            }
        ])

        const { error: insertCurrentError } = await currentAddress;
        if (insertCurrentError) {

            return NextResponse.json({ message: "Insert Customer Issue", error: insertCurrentError })
        }
        let permanentAddress = supabase.from('leap_customer_address').insert([
            {
                client_id: insertCustomer[0].client_id,
                customer_id: insertCustomer[0].customer_id,
                address_line1: addressData.permanent.currentAddressLineOne,
                address_line2: addressData.permanent.currentAddressLineTwo,
                city: addressData.permanent.currentCity,
                state: addressData.permanent.currentState,
                postal_code: addressData.permanent.currentPostalCode,
                country: addressData.permanent.currentCountry,
                latitude: permanent_latlng.length > 0 ? permanent_latlng[0] : null,
                longitude: permanent_latlng.length > 0 ? permanent_latlng[1] : null,
                is_primary: false,
                address_type:"permanent",
                created_at: new Date()


            }
        ])
        const { error: insertPermanentError } = await permanentAddress;


        if (insertPermanentError) {
            return NextResponse.json({ message: "Insert Customer Issue", error: insertPermanentError })
        }
        const emergency_contacts = JSON.parse(fdata.emergencyContactData);
        let emergencyContactE=false;
        
        for (let i = 0; i < emergency_contacts.length; i++) {

            let addEmergencyContact = supabase.from('leap_employee_emergency_contacts').insert([
                {
                    customer_id: insertCustomer[0].customer_id,
                    emergency_contact: emergency_contacts[i].emergencyContactNumber,
                    contact_name: emergency_contacts[i].emergencyContactName,
                    relation: emergency_contacts[i].emergencyContactRelationID,
                    created_at:new Date()
                }
            ])
            const { error: updateEContacterror } = await addEmergencyContact;
            if(updateEContacterror){
                console.log(updateEContacterror);
                
                emergencyContactE=true;
            }

        }

        const ocrDocs = JSON.parse(fields.ocr_details[0]);
        let ocrDocsError=false;
        for (let i = 0; i < ocrDocs.length; i++) {
            console.log(ocrDocs[i]);
            
            let addEmergencyContact = supabase.from('leap_ocr_documents').insert([
                {
                    client_id:fields.client_id[0],
                    customer_id: insertCustomer[0].customer_id,
                    extracted_id: ocrDocs[i].document_extracted_id,
                    document_url: ocrDocs[i].document_url,
                    document_name: ocrDocs[i].document_name,
                    created_at: new Date(),
                }
            ])
            const { error: insertOcrDocsError } = await addEmergencyContact;
            if(insertOcrDocsError){
                console.log(insertOcrDocsError);
                ocrDocsError=true;
            }

        }

        const bank_Data = JSON.parse(fdata.bank_name);
        let bank_data_Error=false;
        for (let i = 0; i < bank_Data.length; i++) {
            let addBankDataCOunt = supabase.from('leap_employee_bank_accounte_count').insert([
                {
                    customer_id: insertCustomer[0].customer_id,
                    bank_data_count: i,
                    created_at: new Date(),
                    
                    
                }
            ]).select("*");
            const {data:bankCountData, error: bankCountError } = await addBankDataCOunt;
            if(bankCountError){
                console.log(bankCountError);
                bank_data_Error=true;
            }else{
                for(let j=0;j<bank_Data[i].form_values.length;j++){
                    let addBankDetails = supabase.from('leap_customer_bank_details').insert([
                        {
                            customer_id: insertCustomer[0].customer_id,
                            client_id: insertCustomer[0].client_id,
                            bank_component_id: bank_Data[i].form_values[j].id,
                            component_value: bank_Data[i].form_values[j].value,
                            bank_account_count_id:bankCountData[0].bank_account_count_id,
                            created_at: new Date(),
                        }
                    ]).select("*");
                    const { error: addEContacterror } = await addBankDetails;
                    if(addEContacterror){
                        console.log(addEContacterror);
                        bank_data_Error=true;
                    }
                }
            }

        }

        return NextResponse.json({ status: 1, message: "Customer inserted successfully", data: insertCustomer }, { status: apiStatusSuccessCode })

    } catch (error) {
        console.log(error);
        return funSendApiException(error);
    }

}