import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

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
   
    const { data: designation, error: designationError } = await supabase.from('leap_client_designations').select();
    if (designationError) {
      return funSendApiErrorMessage(designationError,"Customer data error :- ");
    }
    
      let query = supabase
        .from("leap_customer")
        .select(`
              *,
              leap_client_branch_details(*),leap_client_designations(designation_name)

              `)
              .eq("client_id", formData.get('client_id'))
              

      if (formData.get('branch_id')) {
        query = query.eq("branch_id", formData.get('branch_id'))
      }
      if (formData.get('designation_id')) {
        query = query.eq("designation_id", formData.get('designation_id'))
      }
      const { data: cust, error } = await query;
      
      
      // return NextResponse.json({ status: 1, message: allClientsData, teamsData: cust! }, { status: apiStatusSuccessCode });
      
      if (error) {
        return funSendApiErrorMessage(error,"Customer data error");

      } else{
        const groupedData = cust.reduce((acc, customer) => {
          const { branch_id, designation_id, leap_client_designations } = customer;
        
          // Find or initialize the branch group
          if (!acc[branch_id]) {
            acc[branch_id] = {};
          }
        
          // Find or initialize the designation group within the branch
          if (!acc[branch_id][designation_id]) {
            acc[branch_id][designation_id] = {
              designation_id,
              designation_name: leap_client_designations.designation_name,
              customers: [],
            };
          }
        
          // Add the customer to the respective group
          acc[branch_id][designation_id].customers.push({
            customer
          });
        
          return acc;
        }, {});
        console.log(groupedData);
        const result = Object.entries(groupedData).map(([branchId, designations]) => ({
          branch_id: parseInt(branchId),
          designations: Object.values(designations!),
        }));
        console.log(result);
        return NextResponse.json({ status: 1, message: allClientsData, teamsData: result }, { status: apiStatusSuccessCode });

        
      }
   

      
    

    //  else{
    // for(let i=0;i<designation.length;i++){
    //   for(let j=0;j<cust.length;j++){
    //     if(designation[i].id===cust[j].designation_id){
    //       if(teamsData.length>0){
    //         for(let k=0;k<teamsData.length;k++){
    //           if()
    //         }
    //       }
    //     }
    //   }
    // }
    // }


  } catch (error) {
    console.log(error);
    
    return funSendApiException(error);

  }
}