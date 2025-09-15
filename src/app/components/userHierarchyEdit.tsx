import Head from 'next/head';
import React from 'react'
import UserProfileLeft from './userProfileCardLeft';
import { getImageApiURL, staticIconsBaseURL } from '../pro_utils/stringConstants';
import { EmployeeORGHierarchyDataModel } from '../models/OrgHierarchyDataModel';

export const UserHierarchyEditCard = ({ card, callFetchData }: { card: EmployeeORGHierarchyDataModel, callFetchData: () => void }) => {

    let emp_designation = card.leap_client_designations?.designation_name?.toString() || "";
    let allDataCompleted = false;

    if (card.leap_client_designations == null) {

        allDataCompleted = true
    } else if (card.leap_client_departments == null) {
        allDataCompleted = true
    }
    return (
        <div>
            {/* <input type="checkbox" id={card.emp_id} name="userlist" /> */}
            <label htmlFor={card.emp_id} className="userlist_white">
                <div className="tick"></div>
                <div className="row text-center">
                    <div className="grid grid-cols-1 p-0 userlist_img"><img src={card?.profile_pic ? getImageApiURL +"/uploads/"+ card.profile_pic : staticIconsBaseURL + "/images/userpic.png"} className="img-fluid" /></div>
                    <div className="grid grid-cols-1 p-0 mb-1">Employee Id: <b>{card.emp_id}</b></div>
                    <div className="grid grid-cols-1 p-0 mb-1"><b>{card.name}</b></div>
                    <div className="grid grid-cols-1 p-0 mb-1">Department: <b>{card.leap_client_departments?.department_name?.toString() || "--"}</b></div>
                    <div className="grid grid-cols-1 p-0">Designation: <b>
                        {emp_designation != null && emp_designation.length > 0 ? emp_designation : "--"}
                    </b>
                    </div>
                    {allDataCompleted ? <div className="grid grid-cols-1 dataincomplete_box">Data is Incomplete</div> : <div></div>}

                </div>
            </label>
            {card.manager_id &&
                <UserProfileLeft card={card} isHerarchy={true} callFetchData={() => callFetchData()} />
            }
        </div>
    )
}
