import { NextRequest, NextResponse } from "next/server";
import supabase from "../../../supabaseConfig/supabase";
import { addDays, addMonthsToDate, dashedDateYYYYMMDD, findLastAlphabet, funSendApiErrorMessage, funSendApiException, incrementNumbersInString, parseForm, } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { apiStatusSuccessCode, selectBranch_AddEmployement, UpdateBranchEmployeeCount_AddEmployement } from "@/app/pro_utils/stringConstants";
import { error, log } from "console";
import { getDesignationSetUserRole } from "@/app/pro_utils/constantFunGetData";
import { addErrorLog } from "@/app/pro_utils/constantFunAddData";


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const fdata = {
            client_id: formData.get('client_id'),
            customer_id: formData.get('customer_id'),
            branch_id: formData.get('branch_id'),
            designation_id: formData.get('designation_id'),
            department_id: formData.get('department_id'),
            manager_id: formData.get('manager_id'),
            employment_type_id: formData.get('employment_type_id'),
            work_location: formData.get('work_location'),
            date_of_joining: formData.get('date_of_joining'),
            probation_period: formData.get('probation_period') as string,
            // official_onboard_date: formData.get('official_onboard_date'),
            employee_status: formData.get('employee_status'),
            pay_accural_id: formData.get('pay_accural_id'),

            salaryAmountsArray: formData.get('salaryAmountsArray') as string,
            total_gross_salary: formData.get('total_gross_salary'),
            total_deduction: formData.get('total_deduction'),
            net_payable_salary: formData.get('net_payable_salary'),


        }
        const userRole = await getDesignationSetUserRole(fdata.designation_id);
        const salaryAmounts = JSON.parse(fdata.salaryAmountsArray);
        // return NextResponse.json({ status: 1, message: "Customer inserted successfully", data: fdata}, { status: apiStatusSuccessCode })

        const formatDate = dashedDateYYYYMMDD(fdata.date_of_joining);
        // return NextResponse.json({ status: 1, message: "Customer inserted successfully", data: addDays(formatDate,fdata.probation_period?parseInt(fdata.probation_period):0) }, { status: apiStatusSuccessCode })

        let query = supabase.from('leap_customer').update([
            {
                branch_id: fdata.branch_id,
                designation_id: fdata.designation_id,
                department_id: fdata.department_id,
                manager_id: fdata.manager_id,
                employment_type: fdata.employment_type_id,
                user_role: userRole.role,
                work_location: fdata.work_location,
                date_of_joining: fdata.date_of_joining,
                probation_period: addMonthsToDate(formatDate, parseInt(fdata.probation_period)),
                official_onboard_date: addMonthsToDate(formatDate, parseInt(fdata.probation_period) + 1),
                employment_status: fdata.employee_status,


            }
        ]).eq('customer_id', fdata.customer_id).select()
        // console.log(query);

        //// Update total employee in the branch
        const {data:selectBranch, error:selectBranchError}=await supabase.from('leap_client_branch_details')
                                    .select('total_employees')
                                    .eq('id',fdata.branch_id);
        if(selectBranchError){
            const addError=await addErrorLog(fdata.client_id,selectBranch_AddEmployement,selectBranchError);
        }                            
        const {data: updateEmpCount ,error: updateEmpCountError} =await supabase.from('leap_client_branch_details')
        .update({'total_employees' :selectBranch![0].total_employees+1})
        .eq('id',fdata.branch_id)  
        
        if(updateEmpCountError){
            const addError=await addErrorLog(fdata.client_id,UpdateBranchEmployeeCount_AddEmployement,updateEmpCountError);

        }

        //// Update total employee in the branch end 

        const { error: insertCustError } = await query;
        if (insertCustError) {
            return NextResponse.json({ message: "Insert Customer Issue", error: insertCustError })
        }


        // for(let i=0;i<fdata.salaryAmountsArray)
        for (let i = 0; i < salaryAmounts.length; i++) {
            console.log();

            let salaryDetailsqwery = supabase.from('leap_client_employee_salary').insert([
                {
                    client_id: fdata.client_id,
                    branch_id: fdata.branch_id,
                    customer_id: fdata.customer_id,
                    salary_component_id: salaryAmounts[i].salary_component_id,
                    amount: salaryAmounts[i].salary_component_amount,
                    pay_accural_id: fdata.pay_accural_id,
                    created_at: new Date()
                }

            ]);
            const { error: insertBankError } = await salaryDetailsqwery;

            if (insertBankError) {
                return funSendApiErrorMessage(insertBankError, "Insert Bank Details Issue")
            }

        }
 
        let totalSalaryqwery = supabase.from('leap_employee_total_salary').insert([
            {
                customer_id: fdata.customer_id,
                gross_salary: fdata.total_gross_salary,
                total_deduction: fdata.total_deduction,
                net_pay: fdata.net_payable_salary,
                pay_acural_days:fdata.pay_accural_id,
                created_at: new Date()
            }
        ]);
        // console.log(query);


        const { error: insertTotalSalaryError } = await totalSalaryqwery;

        if (insertTotalSalaryError) {
            return funSendApiErrorMessage(insertTotalSalaryError, "Insert Total Salary Details Issue")
        }
        const { data: insertWorkAnniversary, error: anniversaryError } = await supabase.from("leap_all_birthdays")
            .insert({
                client_id: fdata.client_id,
                customer_id: fdata.customer_id,
                ocassion: "Work Anniversary",
                ocassion_date: fdata.date_of_joining,
                is_enabled: true,
                created_at: new Date()
            });

        return NextResponse.json({ status: 1, message: "Data inserted successfully" }, { status: apiStatusSuccessCode })

    } catch (error) {
        console.log(error);
        return funSendApiException(error);
    }

}


