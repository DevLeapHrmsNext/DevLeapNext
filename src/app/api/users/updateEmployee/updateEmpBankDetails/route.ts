import { NextRequest, NextResponse } from "next/server";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong, updateAdrressFailure, updateAdrressSuccess, updateBankFailure, updateBankSuccess, updateGrossSalaryFailure, updateSalaryFailure } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
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
      client_id: formData.get('client_id'),
      branch_id: formData.get('branch_id'),

     

      salaryAmountsArray: formData.get('salaryAmountsArray') as string,
      bankdetails: formData.get('bankdetails') as string,

      total_salary_table_id: formData.get('total_salary_table_id') ,
      total_gross_salary: formData.get('total_gross_salary'),
      total_deduction: formData.get('total_deduction'),
      net_payable_salary: formData.get('net_payable_salary'),
      pay_accural_id: formData.get('pay_accural_id'),



    }
    const salaryAmounts = JSON.parse(fdata.salaryAmountsArray);
    const bankdet = JSON.parse(fdata.bankdetails);
    console.log("bankdet------=-=-=------", bankdet);
    let eContactUpQuery ;
    for (let i = 0; i < bankdet.length; i++) {
    if(bankdet.bank_account_count_id && bankdet.bank_account_count_id != null){


      console.log("2======================");
      for(let j=0;j<bankdet[i].details.length;j++){
       eContactUpQuery = supabase
      .from("leap_customer_bank_details")
      .update({
         component_value: bankdet.row_value,
        
      }).eq("id",bankdet.pk_row_id);
      const { error } = await eContactUpQuery;
      if (error) {
        console.log(error);

        return NextResponse.json({ message: updateBankFailure, error: error },
          { status: apiStatusFailureCode });

      }
    }
    }else{
      console.log("3======================");
      let addBankDataCOunt = supabase.from('leap_employee_bank_accounte_count').insert([
                {
                    customer_id: fdata.customerId,
                    bank_data_count: i,
                    created_at: new Date(),
                    
                    
                }
            ]).select("*");
      const {data:bankCountData, error: bankCountError } = await addBankDataCOunt;
      if(bankCountError){
                console.log(bankCountError);
                
            }
      for(let j=0;j<bankdet[i].details.length;j++){
          eContactUpQuery = supabase
          .from("leap_customer_bank_details")
          .insert({
            client_id:fdata.client_id,
            customer_id: fdata.customerId,
            bank_component_id: bankdet[i].details[j].component_id,
            component_value: bankdet[i].details[j].row_value,
            bank_account_count_id: bankCountData?bankCountData[0].bank_account_count_id:null,
            created_at:new Date()
          })
          const { error } = await eContactUpQuery;
          console.log("1======================",eContactUpQuery);
          if (error) {
            console.log(error);

            return NextResponse.json({ message: updateBankFailure, error: error },
              { status: apiStatusFailureCode });

          }
        }
      
    
    }
  }

    for (let i = 0; i < salaryAmounts.length; i++) {
      console.log("4======================");
      console.log(salaryAmounts[i]);
      let salaryDetailsqwery;
      if(salaryAmounts[i].id!="0"){
       salaryDetailsqwery = supabase.from('leap_client_employee_salary').update([
        {
          salary_component_id: salaryAmounts[i].salary_component_id,
          amount: salaryAmounts[i].amount,
          created_at: new Date()
        }

      ]).eq("id",salaryAmounts[i].id);
    }else{
      console.log("5======================",);
      salaryDetailsqwery = supabase.from('leap_client_employee_salary').insert([
        {
          
          customer_id:fdata.customerId,
          branch_id:fdata.branch_id,
          client_id:fdata.client_id,
          salary_component_id: salaryAmounts[i].leap_client_salary_components.client_Salary_compionent_id,
          amount: salaryAmounts[i].amount,
          created_at: new Date()
        }

      ])
    }
      
      const { error: insertBankError } = await salaryDetailsqwery;

      if (insertBankError) {
        console.log(insertBankError);
        return funSendApiErrorMessage(updateSalaryFailure, "Insert Bank Details Issue")
      }
    }
    let totalSalaryqwery
    if(fdata.total_salary_table_id!="0"){
      console.log("6======================");
    totalSalaryqwery = supabase.from('leap_employee_total_salary').update([
      {
        gross_salary: fdata.total_gross_salary,
        total_deduction: fdata.total_deduction,
        net_pay: fdata.net_payable_salary,
      }
    ]).eq("id", fdata.total_salary_table_id);
  }else{
    console.log("7======================");
    totalSalaryqwery = supabase.from('leap_employee_total_salary').insert([
      {
        customer_id:fdata.customerId,
        gross_salary: fdata.total_gross_salary,
        total_deduction: fdata.total_deduction,
        net_pay: fdata.net_payable_salary,
        pay_acural_days:fdata.pay_accural_id,

      }
    ])
  }



    const { error: insertTotalSalaryError } = await totalSalaryqwery;

    if (insertTotalSalaryError) {
      return funSendApiErrorMessage(updateGrossSalaryFailure, "Insert Total Salary Details Issue")
    }

    (async () => {

      try {
        const { data: shouldNotify, error } = await supabase.from("leap_client_notification_selected_types").select("*").eq("selected_notify_type_id", 8);
        if (shouldNotify && shouldNotify.length === 0) {
          const formData = new FormData();
          formData.append("customer_id", String(fdata.customerId));
          formData.append("title", "Bank Details Updated");
          formData.append("notify_type", "8");// its 8 for profile related updates in leap_push_notification_types table
          formData.append("message", "Your bank details has been updated.");
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
            method: "POST",
            body: formData
          });
        }
      } catch (err) {
        console.log(err);
      }

    })();

    return NextResponse.json({ message: updateBankSuccess, status: 1 });


  } catch (error) {
    console.log(error);

    return funSendApiException(error);

  }
}