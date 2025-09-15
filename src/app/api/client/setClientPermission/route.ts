import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import {apiStatusSuccessCode, permissionsAddedSuccess } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{

        const formData = await request.formData();
        const fdata = {
            clientId:formData.get('client_id') as string,
            permissinTypeId: formData.get('permissionData')as any,
            // allowRead: formData.get('allow_read_access'),
            // allowInsert: formData.get('allow_insert_access'),
            // allowUpdate: formData.get('allow_update_access'),
            // allowDelete: formData.get('allow_delete_access'),
            
          }
          for (let i = 0; i < fdata.permissinTypeId!.length; i++){
          const { data,error } = await supabase.from('leap_client_permission').insert([
            { client_id: fdata.clientId,
              permission_type_id: fdata.permissinTypeId,
              allow_read_access:fdata.permissinTypeId[i].allowRead,
              allow_insert_access:fdata.permissinTypeId[i].allowInsert,
              allow_update_access:fdata.permissinTypeId[i].allowUpdate,
              allow_delete_access:fdata.permissinTypeId[i].allowDelete,
            }
            
          ]);
          if(error){
            return funSendApiErrorMessage(error, "Client permission insert issue");
          }
        }
            
          
        return NextResponse.json({ message: permissionsAddedSuccess}, { status: apiStatusSuccessCode });
          

  
    }catch(error){
        return funSendApiException(error);
        
    }
}