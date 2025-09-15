import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, assetDeletedSuccess, assetDeleteFailed, apifailedWithException } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function DELETE(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fdata = {
      id: formData.get('id'),
      isSubProject: formData.get('is_sub_project')
    };

    if (!fdata.id) {
      return NextResponse.json({ error: "Asset ID needed" }, { status: apiStatusInvalidDataCode }
      );
    }
    let query;
    if (fdata.isSubProject == "True") {
      query = supabase
        .from('leap_client_sub_projects')
        .update({
          is_deleted: "TRUE",
        })
        .eq('subproject_id', fdata.id)
    } else {
      query = supabase
        .from('leap_client_project')
        .update({
          is_deleted: "TRUE",
        })
        .eq('project_id', fdata.id)
      const { data: subProjects, error } = await supabase
        .from('leap_client_sub_projects')
        .select("*")
        .eq('project_id', fdata.id)
      if (error) {
        return funSendApiErrorMessage(error, "Unable to get sub projects data")
      } else {
        for (let i = 0; i < subProjects.length; i++) {
          const { error } = await supabase
            .from('leap_client_sub_projects')
            .update({
              is_deleted: "TRUE",
            })
            .eq('subproject_id', subProjects[i].subproject_id)
        }
        if (error) {
          return funSendApiErrorMessage(error, "Unable to delete sub projects data")

        }
      }

    }
    const { error } = await query;

    if (error) {
      return funSendApiErrorMessage(error, "Project Deletion Issue");
    }
    return NextResponse.json(
      { status: 1, message: assetDeletedSuccess },
      { status: apiStatusSuccessCode }
    );

  } catch (error) {
    return funSendApiException(error);
  }
}