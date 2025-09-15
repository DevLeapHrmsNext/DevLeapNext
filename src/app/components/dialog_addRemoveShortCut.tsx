'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { LeapDashboardShortcuts } from '../models/DashboardModel';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';

interface SelectedShortCut{
    selected_shortcut_id:any
    shortcutID:any,
    isactive:boolean
}

const ShortCutOneDialog = ({ onClose }: { onClose: () => void }) => {
    
    const [allShortcuts, setAllShortcuts] = useState<LeapDashboardShortcuts[]>([]);
    const { contextClientID } = useGlobalContext();
    const [showResponseMessage, setResponseMessage] = useState(false);
    const [selctedShortCut, setselectedShortcuts] = useState<SelectedShortCut[]>([]);

    useEffect(() => {
        const fetchData = async () => {

            const allShortCuts = await getAllShortCuts();
            setAllShortcuts(allShortCuts);
            const selectedShortcuts = await getSelectedShortCuts(contextClientID);
            console.log("---------------------",selectedShortcuts);
            
            let shortcuts:SelectedShortCut[]=[];
            for(let i=0;i<allShortCuts.length;i++){
                
                        shortcuts.push({
                            selected_shortcut_id: "",
                            shortcutID: allShortCuts[i].shortcut_id,
                            isactive: false
                        })
                        
                    
                }
                
                
                for(let j=0;j<selectedShortcuts.length;j++){
                    
                    
                    for(let i=0;i<shortcuts.length;i++){
                    if(selectedShortcuts[j].shortcut_id===shortcuts[i].shortcutID ){
                        console.log("true");
                        
                        shortcuts[i].selected_shortcut_id=selectedShortcuts[j].selected_shortcut_id
                        shortcuts[i].isactive=selectedShortcuts[j].is_active;
                    }
                    
                }
                }
            
            
            setselectedShortcuts(shortcuts)
            

        };
        fetchData();
    }, []);



    const handleCheckboxChange = (e:any,id: number) => {
        const { name, checked } = e.target;

        setselectedShortcuts((prev) =>
            prev.map((item) =>
                item.shortcutID === id ? { ...item, isactive: checked } : item
            )
    
        );
        console.log(selctedShortCut);
        
    };
    

    const setShortcuts = async (e: React.FormEvent) => {
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("short_cut_id", JSON.stringify(selctedShortCut));
        
        
        console.log("SelectedShortcuts------------------",selctedShortCut);
        console.log("FormData Appended----------------",formData);
        
        try {
            const res = await fetch("/api/clientAdmin/setShortcutsOne", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);

            if (response.status == 1) {
                onClose()
            } else {
                

                alert(response.message)
            }
        } catch (e) {
            console.log(e);
            alert("Somthing went wrong! Please try again.")

        }

    }

    return (
        
            <div className="">
                <div className='rightpoup_close' onClick={onClose}>
                                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                            </div>
                            <div className="row">
                                <div className="col-lg-12 mb-3 inner_heading25">
                                Add/ Remove Shortcut
                                </div>
                            </div>
                <div className="row mb-3 addremove_list">
                    <div className="col-lg-12">
                        {allShortcuts.map((shortcut) => (

                            <label key={shortcut.shortcut_id} className="cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={shortcut.shortcut_id}
                                    name={shortcut.shortcut_id+''}
                                    checked={selctedShortCut.some((item) => item.shortcutID === shortcut.shortcut_id && item.isactive)}
                                    onChange={(e) => handleCheckboxChange(e,shortcut.shortcut_id)}
                                    
                                />
                                <span style={{ marginLeft: "8px" }}>{shortcut.title+" "+ shortcut.sub_title}</span>
                            </label>

                        ))}
                    </div>
                </div>


                <div className="row mb-5">
                    <div className="col-lg-12">
                        <a className="red_button" onClick={setShortcuts}>Update Shortcuts</a>&nbsp;&nbsp;
                        <a className="red_button" onClick={onClose}>Close</a>
                    </div>
                </div>
                {/* {showResponseMessage && <div className="row md-5"><label>Holiday Added Successfully</label></div>} */}
            </div>
        
    )
}

export default ShortCutOneDialog


async function getAllShortCuts() {

    let query = supabase
        .from('leap_dashboard_shortcuts')
        .select();


    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getSelectedShortCuts(clientID: any) {

    let query = supabase
        .from('leap_client_dashboard_shortcuts_one')
        .select()
        .eq("client_id", clientID);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}


