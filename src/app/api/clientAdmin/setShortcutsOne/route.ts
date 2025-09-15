
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, shrotcutsUpdated, } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

    try {
        const { fields, files } = await parseForm(request);

        const fdata = {
            client_id: fields.client_id[0],
            short_cut_id: fields.short_cut_id[0],
        

        }

        const shortCutIdArray = JSON.parse(fields.short_cut_id);
        let dataUpload:any={};
        let query;
        let apiError=false;
        for(let i=0;i<shortCutIdArray.length;i++){
            const selectedShortcutId = shortCutIdArray[i].selected_shortcut_id === "" ? null : shortCutIdArray[i].selected_shortcut_id;

            dataUpload={
                
                client_id: fdata.client_id,
                shortcut_id: shortCutIdArray[i].shortcutID,
                is_active: shortCutIdArray[i].isactive,
                created_at: new Date(),
            }
            if(selectedShortcutId!){
                query =  supabase.from('leap_client_dashboard_shortcuts_one').update(dataUpload).eq("selected_shortcut_id",selectedShortcutId);
            }else{
                query =  supabase.from('leap_client_dashboard_shortcuts_one').insert(dataUpload);
            }
            const { error } =await query;
            
            if(error){
                apiError=true;
            }
        
        
        }
        if(apiError){

        }
    
        return NextResponse.json({ message: shrotcutsUpdated,status:1 }, { status: apiStatusSuccessCode });

    } catch (error) {
        console.log(error);
        return funSendApiException(error);
    }
}
