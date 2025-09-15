// 'use client'
import React, { useState } from 'react'
import { MidShortcutsList, ShrotCutRelatedData, Shortcut } from '../models/DashboardModel'
import supabase from '../api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';
import { baseUrl } from '../pro_utils/stringRoutes';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';


const ClientAdminMidShortcuts = ({ shortCut, related_data, removeClick, onRemoved }: { shortCut: Shortcut, related_data: ShrotCutRelatedData[], removeClick: () => void, onRemoved: () => void }) => {
    const router = useRouter();
    const removeShortcut = async (id: number) => {
        removeClick();
        try {
            const { error } = await supabase.from("leap_client_admin_mid_shortcuts").update({ show_on_dashboard: false }).eq("id", id);
            if (error) {
                alert("Failed to remove shortcut")
            } else {
                onRemoved();
            }
        } catch {
            alert("Something went wrong while removing shortcut please try again")
        }


    };

    function navigateToPage(pageLink: any) {

        router.push(baseUrl + pageLink)
    }
    return (
        <div className="shortcut_list" style={{ backgroundColor: shortCut.leap_dashboard_mid_shortcut.bg_color_code }} onClick={() => navigateToPage(shortCut.leap_dashboard_mid_shortcut.navigation_url! || "/dashboard")} >
            <div className="row mb-2" >
                <div className="col-lg-10 shortcut_heading" >{shortCut.leap_dashboard_mid_shortcut.shortcut_name}</div>
                <div className="col-lg-2" style={{textAlign:"right"}} onClick={(e) => removeShortcut(shortCut.id)}> <img src={staticIconsBaseURL+"/images/close_white.png"} className="img-fluid" style={{ maxHeight: "13px" }} /></div>

            </div>
            {related_data.length>0 ?related_data.map((relatedData,index) => (
                <div className="row pb-1 pt-1" style={{ borderBottom: "1px dotted #fff" }} key={index}>
                    <div className="col-lg-8">
                        {relatedData?.name}
                    </div>
                    <div className="col-lg-4" style={{ textAlign: "right" }}>{relatedData?.date?relatedData?.date:relatedData?.status}</div>
                </div>
            )):<label>No data Available for today</label>}

            
        </div>
    )
}

export default ClientAdminMidShortcuts