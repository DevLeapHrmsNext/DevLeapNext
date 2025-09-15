import { NextRequest, NextResponse } from "next/server";
import supabase from "../../../supabaseConfig/supabase";
import { addDays, addMonthsToDate, dashedDateYYYYMMDD, decodeData, encodeData, findLastAlphabet, funSendApiErrorMessage, funSendApiException, incrementNumbersInString, parseForm, } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { log } from "console";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
//         Base Salary (Amount)
// Pay Frequency (Monthly, Weekly, etc.)
// Allowances and Benefits (Housing, Travel, etc.)
// Deductions (Tax, Insurance, etc.)
// Payroll Group (If segmented)
// Salary Effective Date
        const fdata = {
            customer_id:formData.get('customer_id') ,
            client_id: formData.get('client_id'),
            basic: formData.get('basic_salary'),
            HRA: formData.get('HRA'),
            compensatory_allowance: formData.get('compensatory_allowance'),
            medical_allowance: formData.get('medical_allowance'),
            conveyance_allowance: formData.get('conveyance_allowance'),
            special_allowance: formData.get('special_allowance'),
            tds: formData.get('tds'),
            professional_tax: formData.get('professional_tax'),
            ESIC_deduction: formData.get('ESIC_deduction'),
            provident_fund: formData.get('provident_fund'),
            total_gross_salary: formData.get('total_gross_salary'),
            total_deduction: formData.get('total_deduction'),
            net_payable_salary: formData.get('net_payable_salary'),
            extra: formData.get('extra'),
          }
          
        // return NextResponse.json({ status: 1, message: "Customer inserted successfully", data: "BANK DETAILS" }, { status: apiStatusSuccessCode })
        
        let query = supabase.from('leap_customer_bank_details').insert([
            {   
                customer_id:fdata.customer_id,
                client_id:fdata.client_id,
                
                created_at: new Date()
            }
        ]);
        // console.log(query);


        const { error: insertBankError } = await query;
        
        if (insertBankError) {
            return funSendApiErrorMessage(insertBankError, "Insert Bank Details Issue" )
        }
        
        return NextResponse.json({ status: 1, message: "Bank Details inserted successfully" ,}, { status: apiStatusSuccessCode })

    } catch (error) {
        console.log(error);
        return funSendApiException(error);
    }

}


