import { NextRequest, NextResponse } from "next/server";
import { calculateNumDays, formatDateYYYYMMDD, funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import fs from "fs/promises";


export async function DELETE(request: NextRequest) {

    try {
        // const { data: user, error: userError } = await supabase.auth.getUser();

        const formData = await request.formData();
        const fdata = {
            announcement_id:formData.get('announcement_id') ,
        }
        console.log("delete announcement api is called=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-===-=-");
        
        const {data,error} = await supabase.from('leap_client_announcements').update({isDeleted:true}).eq("announcement_id", fdata.announcement_id);; ;
            if(error){
                return funSendApiErrorMessage(error,"Failed to delete the announcement")
            }
            else{
                return NextResponse.json({ status: 1, message: "Announcement Deleted Successfully" }, { status: apiStatusSuccessCode });
            }
    } catch (error) {

        console.log(error);

        return funSendApiException(error);

    }
}




// if (selectedBranches != null && selectedBranches.length > 0 && roleIDS != null && roleIDS.length > 0) {
//     let queryDesignationAnnouncement ;
//     for (let j = 0; j < selectedBranches.length; j++) {
//         for (let i = 0; i < roleIDS.length; i++) {
//             for(let k=0;k<currentAnouncementData.length;k++){
//                 if(currentAnouncementData[k].role_id==roleIDS[i] && currentAnouncementData[k].branch_id==selectedBranches[j]){
//                     queryDesignationAnnouncement = supabase.from('leap_show_announcement_users')
//                     .update({
//                         branch_id: selectedBranches[j],
//                         client_id: fields.client_id[0],
//                         role_id: roleIDS[i],
//                         is_active:true,
//                         created_at: new Date().toISOString()
//                     }).eq("announcement_id", fields.announcement_id[0]);;
//                 }else{
//                     queryDesignationAnnouncement = supabase.from('leap_show_announcement_users')
//                     .update({
//                         branch_id: selectedBranches[j],
//                         client_id: fields.client_id[0],
//                         role_id: roleIDS[i],
//                         is_active:false,
//                         created_at: new Date().toISOString()
//                     }).eq("announcement_id", fields.announcement_id[0]);;
//                 }
//             }
           
//             console.log("outside of file call -------------------------------4");

//             const { error: queryDesignationAnnouncementError } = await queryDesignationAnnouncement!;
//             if (queryDesignationAnnouncementError) {

//                 console.log("queryDesignationAnnouncementError=======",queryDesignationAnnouncementError);

//                 isError = true;
//             }
//         }
//     }


// }
// }else{
// console.log("outside of file call -------------------------------2");

// let query;
// if (selectedBranches!=null && selectedBranches.length>0 && roleIDS != null && roleIDS.length > 0 ) {
//     for(let j=0;j<selectedBranches.length;j++){

//     for (let i = 0; i < roleIDS.length; i++) {

//         let queryDesignationAnnouncement = supabase.from('leap_show_announcement_users')
//             .insert({
//                 branch_id:selectedBranches[j].id,
//                 client_id:fields.client_id[0],
//                 announcement_id:fields.announcement_id[0],
//                 role_id:roleIDS[i].id,
//                 is_active:true,
//                 created_at: new Date().toISOString()
//             });
//             console.log("leap_show_announcement_users query is this====",queryDesignationAnnouncement);
            
//         const { error: queryDesignationAnnouncementError } = await queryDesignationAnnouncement;
//         if (queryDesignationAnnouncementError) {
//             console.log("leap_show_announcement_users",queryDesignationAnnouncementError);
                            
//             isError = true;
//         }
//     }
// }
// }

