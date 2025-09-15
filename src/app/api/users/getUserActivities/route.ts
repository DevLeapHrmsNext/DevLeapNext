import { NextRequest } from "next/server";
import {  funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";

export async function POST(request: NextRequest) {
    
    try{
        // const { data: user, error: userError } = await supabase.auth.getUser();
    
    
        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const formData = await request.formData();
        
        
        return getAllActivitiesOfUsers(formData.get('client_id'),formData.get('branch_id'))  

  
    }catch(error){
        
        
        return funSendApiException(error);
        
    }
}