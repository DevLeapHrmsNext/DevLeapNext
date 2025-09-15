'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { LeapDashboardShortcuts } from '../models/DashboardModel';

interface SelectedShortCut {

    shortcutID: any,
    isactive: boolean
}

const MidShortcutsDialog = ({ onClose }: { onClose: () => void }) => {

    const [allShortcuts, setAllShortcuts] = useState<leapMidShortCuts[]>([]);
    const [selectedShortcuts, setSelectedSHortcuts] = useState<any[]>([]);
    const { contextClientID } = useGlobalContext();
    const [showResponseMessage, setResponseMessage] = useState(false);
    const [newShortCut, setNewSelectedShortcuts] = useState<SelectedShortCut>();

    useEffect(() => {
        const fetchData = async () => {

            const allShortCuts = await getAllShortCuts(contextClientID);

            const selectedShortcuts = await getSelectedShortCuts(contextClientID);
            setSelectedSHortcuts(selectedShortcuts);
            
            if (selectedShortcuts.length > 0 && selectedShortcuts.length <= allShortCuts.length) {
                for (let i = 0; i < selectedShortcuts.length; i++) {
                    console.log("selectedShortcuts---mid_shortcut_id---", selectedShortcuts[i].mid_shortcut_id);

                    for (let j = 0; j < allShortCuts.length; j++) {
                        console.log("allShortCuts---id---", allShortCuts[j].id);

                        if (selectedShortcuts[i].mid_shortcut_id == allShortCuts[j].id && selectedShortcuts[i].show_on_dashboard == true) {
                            console.log("------------------true--------");

                            allShortCuts.splice(j, 1);
                        }
                    }
                }
            }
            setAllShortcuts(allShortCuts);



        };
        fetchData();
    }, []);



    const handleCheckboxChange = (e: any, id: number) => {
        const { name, checked } = e.target;

        setNewSelectedShortcuts({ shortcutID: id, isactive: checked });
        console.log(newShortCut);

    };


    const setShortcuts = async (e: React.FormEvent) => {
        let dataID = 0;
        let query;
        if(newShortCut?.shortcutID && newShortCut.isactive){
        try {
            for (let i = 0; i < selectedShortcuts.length; i++) {
                if (selectedShortcuts[i].mid_shortcut_id == newShortCut?.shortcutID) {
                    dataID = selectedShortcuts[i].id

                }
            }
            console.log(dataID);
            
            if (dataID == 0) {
                query = supabase
                    .from('leap_client_admin_mid_shortcuts')
                    .insert({
                        mid_shortcut_id: newShortCut?.shortcutID,
                        client_id: contextClientID,
                        show_on_dashboard: true,
                        created_at: new Date()
                    })
            } else {
                query = supabase
                    .from('leap_client_admin_mid_shortcuts')
                    .update({

                        show_on_dashboard: true,

                    }).eq("id", dataID)
            }

            const { data, error } = await query;
            if (error) {
                alert("Failed to update shortcut")
            } else {
                onClose()
            }
        } catch (e) {
            console.log(e);

            alert("Something went wrong")

        }
        }else{
            alert("Please select the shortcut to add");
        }

    }

    return (
        <div className="loader-overlay">
            <div className="loader-dialog">

                <div className="col-lg-12 mb-3 inner_heading25" style={{ backgroundColor:"#e6eff6"}}>Add Shortcut</div>
                <div className="short_checkbox_mainbox mb-4">
                    {allShortcuts.map((shortcut) => (

                        <label key={shortcut.id} className="items-center space-x-2 p-2 border rounded-md cursor-pointer">
                            <input
                                type="checkbox"
                                value={shortcut.id}
                                name={shortcut.id + ''}
                                checked={newShortCut?.shortcutID == shortcut.id}
                                onChange={(e) => handleCheckboxChange(e, shortcut.id)}

                            />
                            {shortcut.shortcut_name}
                        </label>

                    ))}</div>


                <div className="row mb-3">
                    <div className="col-lg-12">
                        <a className="red_button" onClick={setShortcuts}>Add Shortcut</a>&nbsp;&nbsp;
                        <a className="red_button" onClick={onClose}>Close</a>
                    </div>

                </div>
                {/* {showResponseMessage && <div className="row md-5"><label>Holiday Added Successfully</label></div>} */}
            </div>
        </div>
    )
}

export default MidShortcutsDialog


async function getAllShortCuts(client_id:any) {

    let query = supabase
        .from('leap_dashboard_mid_shortcut')
        .select();
    const { data, error } = await query;



    if (error) {
        console.log(error);

        return [];
    } else {
        const selectedShortcuts = await getSelectedShortCuts(client_id);
            if (selectedShortcuts.length == 0 && selectedShortcuts.length != data.length) {
                for (let i = 0; i < data.length; i++) {
                    await supabase
                        .from('leap_client_admin_mid_shortcuts')
                        .insert({
                            mid_shortcut_id: data[i].id,
                            client_id: client_id,
                            show_on_dashboard: false,
                            created_at: new Date()
                        });
                    
                    
                }

            }
        return data;
    }

}
async function getSelectedShortCuts(clientID: any) {

    let query = supabase
        .from('leap_client_admin_mid_shortcuts')
        .select()
        .eq("client_id", clientID);

    const { data, error } = await query;
    console.log(data);

    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}


