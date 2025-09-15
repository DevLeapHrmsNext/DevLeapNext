

//Swapnil design changes on 12th may 2025


'use client'
import supabase from '@/app/api/supabaseConfig/supabase';
import BackButton from '@/app/components/BackButton';
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header';
import LeftPannel from '@/app/components/leftPannel';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { announcementListingPage, deleteDataTypeAnnouncement, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { leftMenuAnnouncementPageNumbers } from '@/app/pro_utils/stringRoutes';
import React, { useEffect, useState } from 'react'
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns';
import moment from 'moment';
import LoadingDialog from '@/app/components/PageLoader';
import DeleteConfirmation from '@/app/components/dialog_deleteConfirmation';
import ShowAlertMessage from '@/app/components/alert';


interface UpdateAnnouncementFormValues {
    announcement_id: any
    branchID: AnnouncementBranchDataID[],
    announceTypeID: any,
    roleTypes: AnnouncementRoleTypesDataID[],
    title: any,
    image: any,
    description: any,
    announcementDate: any,
    newImage: File | any
    startDate: any,
    endDate: any,
    hasValidity: any,
    enabled: any,


}
interface AnnouncementBranchDataID {
    branch_data_id: any
    id: any,
    branch_name: any,
    isSelected: boolean
}
interface AnnouncementRoleTypesDataID {
    role_data_id: any
    id: any,
    role_types: any,
    isSelected: boolean
}
const UpdateAnnouncement = () => {
    const { contextAnnouncementID } = useGlobalContext();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [announceImage, setAnnounceImage] = useState("");
    const [announcementList, setAnnouncementList] = useState<AnnouncementList[]>([]);
    const { contextClientID, contextCustomerID, contaxtBranchID, contextRoleID } = useGlobalContext();
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [announcementTypeArray, setAnnouncementTypeArray] = useState<AnnouncementType[]>([]);
    const [roleTypeArray, setRoleTypes] = useState<Roles[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [AnnouncementDeleteID, setAnnouncementDeleteID] = useState(0);
    const [ShowDeleteAnnouncementDialog, setShowDeleteAnnouncementDialog] = useState(false);
    const [AnnouncementDeleteTitle, setAnnouncementDeleteTitle] = useState('');

    const [showAlert,setShowAlert]=useState(false);
    const [alertForSuccess,setAlertForSuccess]=useState(0);
    const [alertTitle,setAlertTitle]=useState('');
    const [alertStartContent,setAlertStartContent]=useState('');
    const [alertMidContent,setAlertMidContent]=useState('');
    const [alertEndContent,setAlertEndContent]=useState('');
    const [alertValue1,setAlertValue1]=useState('');
    const [alertvalue2,setAlertValue2]=useState('');

    const [announcementFormValues, setFormValues] = useState<UpdateAnnouncementFormValues>({
        announcement_id: 0,
        branchID: [

            {
                branch_data_id: 0,
                id: 0,
                branch_name: '',
                isSelected: false
            }],
        announceTypeID: 0,
        roleTypes: [{
            role_data_id: 0,
            id: 0,
            role_types: '',
            isSelected: false
        }],
        title: '',
        image: '',
        description: '',
        announcementDate: '',
        newImage: null,
        startDate: '',
        endDate: '',
        hasValidity: false,
        enabled: false,
    });

    const [errors, setErrors] = useState<Partial<AnnouncementValues>>({});
    const [allRoleSelected, setAllRoleSelected] = useState(false);
    const [allBranchSelected, setAllBranchSelected] = useState(false);

    useEffect(() => {

        fetchData();

        const handleScroll = () => {
            setScrollPosition(window.scrollY); // Update scroll position
            const element = document.querySelector('.mainbox');
            if (window.pageYOffset > 0) {
                element?.classList.add('sticky');
            } else {
                element?.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    const fetchData = async () => {
        setLoading(true);
        const branch = await getBranches(contextClientID);
        setBranchArray(branch);
        const branchIDS: AnnouncementBranchDataID[] = [];
        const roleIDs: AnnouncementRoleTypesDataID[] = [];
        for (let i = 0; i < branch.length; i++) {
            branchIDS.push({
                branch_data_id: 0,
                id: branch[i].id,
                branch_name: branch[i].branch_number,
                isSelected: false
            })
        }
        const announcementTYpe = await getAnnouncementType();
        setAnnouncementTypeArray(announcementTYpe);
        const roles = await getRoleType(contextClientID);
        setRoleTypes(roles);
        for (let i = 0; i < roles.length; i++) {
            roleIDs.push({
                role_data_id: 0,
                id: roles[i].id,
                role_types: roles[i].user_role,
                isSelected: false
            })
        }
        const annoncement = await getAnnouncement(contextAnnouncementID);
        if (annoncement) {
            let selectedBranch = 0, selectedRoles = 0;

            for (let a = 0; a < branchIDS.length; a++) {
                for (let i = 0; i < annoncement[0].leap_show_announcement_users.length; i++) {
                    console.log("this si the annoncement[0].leap_show_announcement_users[i].branch_id branches", annoncement[0].leap_show_announcement_users[i].branch_id);

                    if (branchIDS[a].id == annoncement[0].leap_show_announcement_users[i].branch_id) {
                        branchIDS[a].branch_data_id = annoncement[0].leap_show_announcement_users[i].id
                        branchIDS[a].isSelected = true;
                    }
                }
                if (branchIDS[a].isSelected) {
                    selectedBranch = selectedBranch + 1;
                }
            }
            console.log("this si the lenght of branchIDS.length branches", branchIDS.length);


            if (selectedBranch == branch.length) {
                setAllBranchSelected(true);
            }
            for (let a = 0; a < roleIDs.length; a++) {
                for (let i = 0; i < annoncement[0].leap_show_announcement_users.length; i++) {
                    if (roleIDs[a].id == annoncement[0].leap_show_announcement_users[i].role_id) {
                        roleIDs[a].role_data_id = annoncement[0].leap_show_announcement_users[i].id

                        roleIDs[a].isSelected = true;
                    }

                }

                if (roleIDs[a].isSelected) {
                    selectedRoles = selectedRoles + 1
                }
            }
            if (selectedRoles == roleIDs.length) {
                setAllRoleSelected(true);
            }
            console.log("this is the enabled key value", annoncement[0].isEnabled);

            const parsedData: UpdateAnnouncementFormValues = {
                announcement_id: annoncement[0].announcement_id,

                branchID: branchIDS,
                announceTypeID: annoncement[0].announcement_type_id,
                roleTypes: roleIDs,
                title: annoncement[0].announcement_title,
                image: annoncement[0].announcement_image,
                description: annoncement[0].announcement_details,
                announcementDate: annoncement[0].announcement_date,
                startDate: annoncement[0].send_on_date,
                endDate: annoncement[0].validity_date,
                enabled: annoncement[0].isEnabled,
                hasValidity: annoncement[0].hasValidity,
                newImage: null
            }

            setFormValues(parsedData);
        }
        setLoading(false);
    }
    const setImage = (e: any) => {
        const { name, value, type, files } = e.target;

        setFormValues((prev) => ({ ...prev, ['newImage']: files[0] }));
        setAnnounceImage(URL.createObjectURL(files[0]))
        // console.log("Form values updated:", formValues);s

    };
    const handleInputChange = async (e: any) => {
        const { name, value, checked, type, files } = e.target;
        console.log("name from selected options", name);
        console.log("value from selected options", checked);

        let selectedOptions: any = [];

        if (name === "branchID" || name === "roleTypes") {
            selectedOptions = Array.from(e.target.selectedOptions, (option) => (option as HTMLOptionElement).value);
            setFormValues((prev) => ({ ...prev, [name]: selectedOptions }));
        } else if (name === "showAll" || name === "enabled") {
            setFormValues((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("branch_id", contaxtBranchID);
        formData.append("announcement_id", announcementFormValues.announcement_id);

        formData.append("selectedBranches", JSON.stringify(announcementFormValues.branchID));
        formData.append("role_ids", JSON.stringify(announcementFormValues.roleTypes));
        formData.append("announcement_type_id", announcementFormValues.announceTypeID);
        formData.append("announcement_title", announcementFormValues.title);
        formData.append("announcement_details", announcementFormValues.description);
        formData.append("image", announcementFormValues.image);

        formData.append("file", announcementFormValues.newImage ? announcementFormValues.newImage : announcementFormValues.newImage);
        // formData.append("announcement_date", announcementFormValues.startDate);
        formData.append("startDate", announcementFormValues.startDate);
        formData.append("endDate", announcementFormValues.endDate);
        formData.append("is_enabled", announcementFormValues.enabled);

        try {
            const apiCall = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/clientAdmin/updateAnnouncement", {
                method: "POST",
                body: formData,

            });
            const response = await apiCall.json();
            console.log(response);

            if (apiCall.ok) {
                setLoading(false);
                alert(response.message)
            } else {
                setLoading(false);
                e.preventDefault();
                alert("Failed to submit form.");
            }
        } catch (error) {
            setLoading(false);
            e.preventDefault();
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form." + error);
        }

    }

    const handleAllSelected = (isBranch: boolean, isSelected: boolean) => {

        if (isBranch) {
            setAllBranchSelected(!isSelected)
            if (isSelected) {
                setFormValues((prev) => {
                    const updatedBranches = prev.branchID.map((branch) => ({
                        ...branch,
                        isSelected: false
                    }));

                    console.log(updatedBranches);

                    return { ...prev, branchID: updatedBranches };
                });
            } else {
                setFormValues((prev) => {
                    const updatedBranches = prev.branchID.map((branch) => ({
                        ...branch,
                        isSelected: true
                    }));



                    return { ...prev, branchID: updatedBranches };
                });
            }
        } else {
            setAllRoleSelected(!isSelected)
            if (isSelected) {
                setFormValues((prev) => {
                    const updatedBranches = prev.roleTypes.map((role) => ({
                        ...role,
                        isSelected: false
                    }));

                    console.log(updatedBranches);

                    return { ...prev, roleTypes: updatedBranches };
                });
            } else {
                setFormValues((prev) => {
                    const updatedBranches = prev.roleTypes.map((role) => ({
                        ...role,
                        isSelected: true
                    }));
                    return { ...prev, roleTypes: updatedBranches };
                });
            }
        }
    }

    const handleBranchToggle = (branchId: any, isSelected: boolean) => {
        setFormValues((prev) => {
            const updatedBranches = prev.branchID.map((branch) =>
                branch.id === branchId
                    ? { ...branch, isSelected: !branch.isSelected }
                    : branch
            );
            return { ...prev, branchID: updatedBranches };
        });

    };

    const handleRoleToggle = (role_id: any, isSelected: boolean) => {

        setFormValues((prev) => {
            const updatedBranches = prev.roleTypes.map((role) =>
                role.id === role_id
                    ? { ...role, isSelected: !role.isSelected }
                    : role
            );
            return { ...prev, roleTypes: updatedBranches };
        });

    };
    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    const handleChange = (ranges: RangeKeyDict) => {
        setState([ranges.selection]);
        setShowCalendar(false)

        setFormValues((prev) => ({ ...prev, ['startDate']: formatDateYYYYMMDD(ranges.selection.startDate) }));
        setFormValues((prev) => ({ ...prev, ['endDate']: formatDateYYYYMMDD(ranges.selection.endDate) }));



    };

    return (

        <div className='mainbox'>
            <header>
                <LeapHeader title={announcementListingPage} />
            </header>
            <LeftPannel menuIndex={leftMenuAnnouncementPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <form onSubmit={handleSubmit}>
                    <div className='container'>
                        <LoadingDialog isLoading={isLoading} />
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            fetchData();
                            setShowAlert(false)
                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                        <div className="row heading25">
                            <div className="col-lg-8">
                                Update <span>Announcement/ News</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8 mb-5 mt-4">
                                <div className="grey_box">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Branch<span className='req_text'>*</span>:</label>

                                                <div className="horizontal_scrolling pb-2" >
                                                    <div onClick={() => handleAllSelected(true, allBranchSelected)} className={allBranchSelected ? "announcement_branch_box announcement_branch_box_selected" : "announcement_branch_box"}>
                                                        All
                                                    </div>
                                                    {announcementFormValues.branchID.map((branch) => (
                                                        <div onClick={() => handleBranchToggle(branch.id, branch.isSelected)} className={branch.isSelected ? "announcement_branch_box announcement_branch_box_selected" : "announcement_branch_box"} key={branch.id} style={{ width: "auto" }}>
                                                            {branch.branch_name}
                                                        </div>
                                                    ))}
                                                </div>
                                                {errors.branchID! && <span className='error' style={{ color: "red" }}>{errors.branchID}</span>}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form_box mb-5">
                                                <label htmlFor="formFile" className="form-label">Role Type<span className='req_text'>*</span>:</label>
                                                <div onClick={() => handleAllSelected(false, allRoleSelected)} className={allRoleSelected ? "announcement_branch_box announcement_branch_box_selected" : "announcement_branch_box"} style={{ width: "auto" }}>
                                                    All
                                                </div>
                                                {announcementFormValues.roleTypes.map((roles) => (
                                                    <div onClick={() => handleRoleToggle(roles.id, roles.isSelected)} className={roles.isSelected ? "announcement_branch_box announcement_branch_box_selected" : "announcement_branch_box"} key={roles.id} >
                                                        {roles.role_types}
                                                    </div>
                                                ))}
                                                {errors.roleTypes && <span className='error' style={{ color: "red" }}>{errors.roleTypes}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Announcement Type<span className='req_text'>*</span>:</label>
                                                <select id="announceTypeID" name="announceTypeID" value={announcementFormValues.announceTypeID} onChange={handleInputChange}>
                                                    <option value="">Select</option>
                                                    {announcementTypeArray.map((types, index) => (
                                                        <option value={types.announcement_type_id} key={types.announcement_type_id}>{types.announcement_type}</option>
                                                    ))}
                                                </select>
                                                {errors.announceTypeID && <span className='error' style={{ color: "red" }}>{errors.announceTypeID}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Title<span className='req_text'>*</span>:</label>
                                                <input type="text" className="form-control" id="title" name="title" value={announcementFormValues.title} onChange={handleInputChange} placeholder="Enter title" />

                                                {errors.title && <span className='error' style={{ color: "red" }}>{errors.title}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Date<span className='req_text'>*</span>: </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={announcementFormValues.startDate + " - " + announcementFormValues.endDate}
                                                    readOnly
                                                    onClick={() => setShowCalendar(!showCalendar)}
                                                />
                                                {showCalendar && (
                                                    <div style={{ position: 'absolute', zIndex: 1000 }}>
                                                        <DateRange
                                                            editableDateInputs={true}
                                                            onChange={handleChange}
                                                            moveRangeOnFirstSelection={false}
                                                            ranges={state}
                                                            minDate={new Date()}
                                                        />
                                                    </div>
                                                )}
                                                {errors.startDate || errors.endDate && <span className='error' style={{ color: "red" }}>{errors.startDate || errors.endDate}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Description<span className='req_text'>*</span>:</label>
                                                <textarea className="form-control" id="title" name="description" value={announcementFormValues.description} onChange={handleInputChange} placeholder="Enter details" />

                                                {errors.description && <span className='error' style={{ color: "red" }}>{errors.description}</span>}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-lg-12 announcement_switch_row">
                                            <label htmlFor="formFile" className="form-label" style={{ float: "left", margin: "5px 10px 0 0" }}>Disable:</label>
                                            <label className="switch">
                                                <input type="checkbox" name="enabled" checked={announcementFormValues.enabled ? false : true} onChange={(e) => {

                                                    setFormValues((prev) => ({ ...prev, enabled: !e.target.checked }))
                                                }} />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>

                                        <div className="col-lg-12" style={{ textAlign: "right" }}>
                                            <div className="div" style={{ float: "right" }}><BackButton isCancelText={false} /></div>
                                            <input type="submit" value="Submit" className="red_button" />&nbsp;
                                        </div>
                                    </div>


                                    {/* <div className="row">
                                        <div className="col-lg-12" style={{ textAlign: "right" }}>
                                            <BackButton isCancelText={false} />
                                            <input type="submit" value="Submit" className="red_button" />
                                        </div>
                                    </div> */}
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div style={{ margin: "0 auto", maxWidth: "240px", position: "relative" }}>
                                                <div onClick={() => { setAnnouncementDeleteID(announcementFormValues.announcement_id); setShowDeleteAnnouncementDialog(true); setAnnouncementDeleteTitle(announcementFormValues.title) }} className='delete_announcement_btn'>
                                                    Delete Announcement
                                                    <img src={`${staticIconsBaseURL}/images/delete.png`} className="img-fluid" style={{ margin: "0 0 0 8px", maxHeight: "18px" }} />
                                                </div>
                                            </div>
                                            {/* <img
                                                src={`${staticIconsBaseURL}/images/delete.png`}
                                                className="img-fluid"
                                                style={{ maxHeight: '28px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    setAnnouncementDeleteID(announcementFormValues.announcement_id);
                                                    setShowDeleteAnnouncementDialog(true);
                                                    setAnnouncementDeleteTitle(announcementFormValues.title)
                                                }}
                                            /> */}
                                            {ShowDeleteAnnouncementDialog && <DeleteConfirmation onClose={() => { setShowDeleteAnnouncementDialog(false), fetchData() }} id={AnnouncementDeleteID} deletionType={deleteDataTypeAnnouncement} deleteDetail={AnnouncementDeleteTitle} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mt-4">
                                <div className="grey_box text-center" style={{ backgroundColor: "#d2e3f1", padding: "20px", borderRadius: "10px", height: "380px", width: "350px", boxShadow: "0 0 10px .1px #e6e6e6" }}>
                                    <div className="profile-picture-container" style={{ marginBottom: "20px", alignContent: "center", height: "200px" }}>

                                        <img
                                            src={announceImage.length > 0 ? announceImage : announcementFormValues.image ? getImageApiURL + "/uploads/" + announcementFormValues.image : staticIconsBaseURL + "/images/user.png"} className="img-fluid"
                                            style={{
                                                // backgroundImage: "url(/images/user.png)",
                                                width: "180px",
                                                height: "180px",
                                                borderRadius: "10%",
                                            }} />


                                    </div>
                                    <div className="upload-section">
                                        {/* <div
                                        style={{
                                        width: "200px",
                                        height: "100px",
                                        backgroundImage: formValues.profileImage?`url(${formValues.profileImage})`: "url(images/user.png)",
                                        border: "thin dotted",
                                        backgroundColor: "#E6F0FA",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "end",
                                        margin: "0 auto",
                                        position: "relative",
                                        borderRadius: "10px"
                                        }}><p style={{ marginTop: "10px", fontSize: "13px", color: "#777" }}>
                                        No file chosen, yet!
                                    </p></div> */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="profilePictureUpload"

                                            onChange={setImage}
                                            style={{ display: "none" }}
                                        />
                                        <label
                                            htmlFor="profilePictureUpload"
                                            style={{
                                                backgroundColor: "#FF0000",
                                                color: "#FFF",
                                                padding: "6px 20px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                margin: "-10px 0px 0px 0",
                                                position: "relative"
                                            }}
                                        >Choose a File </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            }
            />
            <Footer />
        </div>
    );
}

export default UpdateAnnouncement


async function getBranches(contextClientID: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select()
        .eq("client_id", contextClientID);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getAnnouncementType() {

    let query = supabase
        .from('leap_announcement_types')
        .select();


    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {

        return data;
    }

}

async function getRoleType(contextClientID: any) {
    const { data: client, error: clientError } = await supabase
        .from('leap_client')
        .select().eq('parent_id', contextClientID);

    if (clientError) {
        return [];
    }
    let query = null
    if (client && client.length > 0) {
        query = supabase
            .from('leap_user_role')
            .select().gte('id', '3');
    } else {
        query = supabase
            .from('leap_user_role')
            .select().gte('id', '4');
    }



    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {

        return data;
    }

}

async function getAnnouncement(announcement_id: any) {

    let query = supabase
        .from('leap_client_announcements')
        .select(`*,leap_show_announcement_users(*,leap_client_branch_details(branch_number),leap_user_role(user_role))`)
        .eq("announcement_id", announcement_id);
    const { data, error } = await query;

    if (error) {
        console.log(error);

        return [];
    } else {
        console.log(data);


        return data;
    }

}