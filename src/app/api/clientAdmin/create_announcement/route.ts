import { NextRequest, NextResponse } from "next/server";
import { addDays, calculateNumDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import fs from "fs/promises";
import { apiStatusSuccessCode, getImageApiURL } from "@/app/pro_utils/stringConstants";
import { apiUploadDocs } from "@/app/pro_utils/constantFunAddData";


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
        const { fields, files } = await parseForm(request);
        // return NextResponse.json({ status: 1, message: "Announcement Added Successfully",data: fields.show_to_department[0][0] }, { status: apiStatusSuccessCode })

        if (!files || !files.file) {
            return NextResponse.json({ error: "No files received." }, { status: 400 });
        }

        let fileUploadResponse;
        if (files && files.file && files.file.length > 0) {
            fileUploadResponse = await apiUploadDocs(files.file[0], fields.branch_id[0], fields.client_id, "announcement_img")

        }
        // return NextResponse.json({ status: 1, message: "Ann  ouncement Added Successfully",data: designationIDs,departmentIDs }, { status: apiStatusSuccessCode })

        // return NextResponse.json({satatus:1,message: " Date issue",data:addDays(formatDate, parseInt(fields.num_of_days[0]))},{status:200})
        let isError = false;
        let num_of_days = 0;
        if (fields.endDate && fields.endDate.length > 0) {
            num_of_days = calculateNumDays(new Date(fields.startDate[0]), new Date(fields.endDate[0]))

        }

        console.log("startdate===============", fields.is_enabled);
        console.log("end_date==================", fields.endDate[0]);

        let query;
        if (fields.endDate && fields.endDate.length > 0 && fields.endDate[0]) {
            query = supabase.from('leap_client_announcements')

                .insert({
                    client_id: fields.client_id[0],
                    branch_id: fields.branch_id[0],
                    announcement_title: fields.announcement_title[0],
                    announcement_details: fields.announcement_details[0],
                    announcement_type_id: parseInt(fields.announcement_type_id[0]),
                    announcement_image: fileUploadResponse ? fileUploadResponse : "",
                    send_on_date: fields.startDate[0],
                    announcement_date: fields.startDate[0] ? formatDateYYYYMMDD(fields.startDate[0]) : formatDateYYYYMMDD(new Date()),
                    num_of_days: num_of_days,
                    validity_date: formatDateYYYYMMDD(fields.endDate[0]),
                    isEnabled: fields.is_enabled[0],

                    created_at: new Date().toISOString()
                }).select();
        } else {
            query = supabase.from('leap_client_announcements')

                .insert({
                    client_id: fields.client_id[0],
                    branch_id: fields.branch_id[0],
                    announcement_title: fields.announcement_title[0],
                    announcement_details: fields.announcement_details[0],
                    announcement_type_id: parseInt(fields.announcement_type_id[0]),
                    announcement_image: fileUploadResponse ? fileUploadResponse : "",
                    announcement_date: fields.startDate[0] ? formatDateYYYYMMDD(fields.startDate[0]) : formatDateYYYYMMDD(new Date()),
                    send_on_date: fields.startDate[0] || new Date().toISOString(),
                    num_of_days: num_of_days,
                    isEnabled: fields.is_enabled[0] == "true" ? true : false,
                    created_at: new Date().toISOString()
                }).select();
        }

        console.log("this is the announcement query ====-==-=-==-=-==-==-=-=-=-", query);

        const { data: announcement, error: annError } = await query;

        if (annError) {
            return funSendApiErrorMessage(annError, "Announcemnt insert issue");
        }
        const roleIDS = JSON.parse(fields.role_ids);
        const selectedBranches = JSON.parse(fields.selectedBranches);

        if (selectedBranches != null && selectedBranches.length > 0 && roleIDS != null && roleIDS.length > 0) {
            for (let j = 0; j < selectedBranches.length; j++) {
                if (selectedBranches[j].isSelected) {
                    for (let i = 0; i < roleIDS.length; i++) {
                        if (roleIDS[i].isSelected) {
                            let queryDesignationAnnouncement = supabase.from('leap_show_announcement_users')
                                .insert({
                                    branch_id: selectedBranches[j].id,
                                    client_id: fields.client_id[0],
                                    announcement_id: announcement![0].announcement_id,
                                    role_id: roleIDS[i].id,
                                    is_active: true,
                                    created_at: new Date().toISOString()
                                });
                            console.log("leap_show_announcement_users query is this====", queryDesignationAnnouncement);

                            const { error: queryDesignationAnnouncementError } = await queryDesignationAnnouncement;
                            if (queryDesignationAnnouncementError) {
                                console.log("leap_show_announcement_users", queryDesignationAnnouncementError);

                                isError = true;
                            }


                        }
                    }
                }
            }

        }

        (async () => {
            const { data: shouldNotify, error } = await supabase.from("leap_client_notification_selected_types").select("*").eq("selected_notify_type_id", 2);
            if (shouldNotify && shouldNotify.length === 0) {
                try {
                    if (selectedBranches != null && selectedBranches.length > 0) {
                        for (let j = 0; j < selectedBranches.length; j++) {
                            if (selectedBranches[j].isSelected) {
                                for (let k = 0; k < roleIDS.length; k++) {
                                    if (roleIDS[k].isSelected) {
                                        if (isToday(fields.startDate[0]) && fields.is_enabled[0] == "true") {
                                            console.log("inside push notification", roleIDS[k].id, selectedBranches[j].id);

                                            const formData = new FormData();
                                            const { data: users, error: usersError } = await supabase.from('leap_customer').select('customer_id').eq("user_role", roleIDS[k].id).eq('branch_id', selectedBranches[j].id);
                                            if (usersError) {
                                                console.log("error in fetching users for push notification", usersError);

                                            } else {
                                                if (users && users.length > 0) {
                                                    for (const user of users) {
                                                        formData.append("customer_id", String(user.customer_id));
                                                        formData.append("title", "New Announcement");
                                                        formData.append("notify_type", "2");// its 2 for announcement in leap_push_notification_types table
                                                        formData.append("message", fields.announcement_title[0]);
                                                        formData.append("attachment_url", fileUploadResponse ? getImageApiURL + fileUploadResponse : "");
                                                        formData.append("send_once", "0");// 0 means false
                                                        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
                                                            method: "POST",
                                                            body: formData
                                                        });
                                                        console.log("this is the response after sending push notification", res);
                                                    }
                                                }
                                            }

                                        }
                                    }

                                }
                            }
                        }
                    }
                } catch (err) {
                    console.log("Error in sending push notification", err);
                }
            }
        }
        )();
        return NextResponse.json({ status: 1, message: isError ? "Some Announcement data Added" : "Announcement Added Successfully" }, { status: apiStatusSuccessCode });

    } catch (error) {
        return funSendApiException(error);
    }
}

function isToday(dateString: string): boolean {
    const today = new Date();
    const givenDate = new Date(dateString);

    // Format both to YYYY-MM-DD
    const todayStr = today.toISOString().split("T")[0];
    const givenDateStr = givenDate.toISOString().split("T")[0];

    return todayStr === givenDateStr;
}