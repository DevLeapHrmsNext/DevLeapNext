'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { leftMenuCompanyPayrollPageNumbers, leftMenuPayrollSub1PageNumbers } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import Select from "react-select";
import moment from 'moment'
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns'
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'


interface FilterValues {
    branchID: any,
    start_month: any,
    end_month: any,
    name: any
}


const CompanyPayroll = () => {


    const [scrollPosition, setScrollPosition] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const { contextClientID, contaxtBranchID } = useGlobalContext();
    const [filterValues, setFilterValues] = useState<FilterValues>({
        branchID: '',
        name: '',
        start_month: '',
        end_month: ''
    });
    const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [branchArray, setBranchArray] = useState<LeapBranchesNameID[]>([]);
    const [empPayrollData, setEmpPayrollData] = useState<EmpPayrollResponseModel[]>([]);

    const [totalPayrollData, setTotalPayData] = useState<TotalPayrollResponse>();
    const [showDetailPayrollCustID, setShowDetailPay] = useState(-1);

    const [hasMoreData, setHasMoreData] = useState(true);
    const [selectedPage, setSelectedPage] = useState(1);
    const [showCalendar, setShowCalendar] = useState(false);
    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);


    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        fetchFilters();

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

    const handleEmpSelectChange = async (values: any) => {
        console.log(values);

        setFilterValues((prev) => ({ ...prev, ["name"]: values.value }));
        setSelectedEmployee(values)
        // setBranchArray(branch);
    };


    const fetchFilters = async () => {
        const branches = await getBranches(contextClientID);
        setBranchArray(branches);

        setFilterValues({
            start_month: formatDateYYYYMM(new Date()),
            end_month: formatDateYYYYMM(new Date()),
            name: "",
            branchID: ''
        });
        const employeeList = await getEmployees(contextClientID, "")
        let empNames: any[] = []
        for (let i = 0; i < employeeList.length; i++) {
            empNames.push({
                value: employeeList[i].customer_id,
                label: employeeList[i].emp_id + "  " + employeeList[i].name,
            })

        }
        setEmployeeNames(empNames);
        fetchData();
    }

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        // console.log("Form values updated:", formValues);
        setFilterValues((prev) => ({ ...prev, [name]: value }));
        if (name == "branchID") {
            const employeeList = await getEmployees(contextClientID, value)
            let empNames: any[] = []
            for (let i = 0; i < employeeList.length; i++) {

                empNames.push({
                    value: employeeList[i].customer_id,
                    label: employeeList[i].emp_id + "  " + employeeList[i].name,
                })

            }
            setEmployeeNames(empNames);
        }
    }
    const resetFilter = async () => {

        window.location.reload();
        setFilterValues({
            start_month: formatDateYYYYMM(new Date()),
            end_month: formatDateYYYYMM(new Date()),
            name: "",
            branchID: ""
        });
        fetchData();
    }
    const formatDateYYYYMM = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM');
    };
    const onFilterSubmit = async () => {
        fetchData();
    }
    function changePage(page: any) {
        if (hasMoreData) {
            setSelectedPage(selectedPage + page);
            fetchData();
        }
    }
    //// her comes the APi call to fettch payroll for current month data
    const fetchData = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("branch_id", filterValues.branchID);
            formData.append('start_month', formatDateYYYYMM(filterValues.start_month) || formatDateYYYYMM(new Date()));
            formData.append('end_month', formatDateYYYYMM(filterValues.end_month) || formatDateYYYYMM(new Date()));
            formData.append('emp_name', filterValues.name || "");

            const response = await fetch("/api/clientAdmin/payroll/fetch_payroll_data", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {

                setLoading(false);
                setLoadingCursor(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to call api.");
                setAlertForSuccess(2)
            } else {
                const jsonData = await response.json();
                if (jsonData.status == 1) {
                    console.log(jsonData.empPayrolls);

                    setEmpPayrollData(jsonData.empPayrolls);
                    setTotalPayData(jsonData.total);
                    setLoading(false);
                    setLoadingCursor(false);
                } else {
                    setLoading(false);
                    setLoadingCursor(false);
                    setShowAlert(true);
                    setAlertTitle("Error")
                    setAlertStartContent("Failed to get data");
                    setAlertForSuccess(2)
                }
            }

        } catch (e) {
            console.log(e);

            setLoading(false);
            setLoadingCursor(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)

        }
    }

    const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };

    const handleChange = (ranges: RangeKeyDict) => {
        console.log(ranges);

        setState([ranges.selection]);
        setShowCalendar(false)
        if (ranges.selection.startDate == ranges.selection.endDate) {
            setFilterValues((prev) => ({ ...prev, ['start_month']: ranges.selection.startDate }));
        } else {
            setFilterValues((prev) => ({ ...prev, ['start_month']: ranges.selection.startDate }));
            setFilterValues((prev) => ({ ...prev, ['end_month']: ranges.selection.endDate }));

        }
    };


    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={leftMenuCompanyPayrollPageNumbers} subMenuIndex={leftMenuPayrollSub1PageNumbers} showLeftPanel={true} rightBoxUI={

                <div>
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className='container'>
                        <div className="row heading25 mb-3">
                            <div className="col-lg-10">
                                Company <span>Payroll</span>
                            </div>

                            <div className="col-lg-2" style={{ textAlign: "right" }}>
                                <div className="row" >

                                    <div className="col-lg-12">

                                        <a className="red_button" >Export</a>&nbsp;
                                        {/* <div className="filtermenu red_button" onClick={filter_whitebox}>Filter</div> */}

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ marginBottom: "20px" }}>
                            <div className="col-lg-12">
                                <div className="attendance_filter_box" id="filter_whitebox_open">
                                    <div className="row" style={{ alignItems: "center" }}>
                                        <div className="col-lg-3">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Branch:</label>

                                                <select id="branchID" name="branchID" value={filterValues.branchID} onChange={handleInputChange}>
                                                    <option value="">Select</option>
                                                    {branchArray.map((branch, index) => (
                                                        <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                                    ))}
                                                </select>

                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Name:</label>
                                                <Select
                                                    value={selectedEmployee}
                                                    options={employeeName}
                                                    onChange={(selectedOption) =>
                                                        handleEmpSelectChange(selectedOption)
                                                    }
                                                    placeholder="Select..."
                                                    isSearchable
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3">

                                            <div className="form_box mb-3">

                                                <label htmlFor="formFile" className="form-label">Start Date:</label>
                                                {/* <input type="month" name="start_month" value={filterValues.start_month} onChange={handleInputChange} /> */}
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formattedRange}
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
                                                        />
                                                    </div>)}
                                            </div>
                                        </div>
                                        {/* <div className="col-lg-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">End Date: </label>
                                                <input type="month" id="date" name="end_month" value={filterValues.end_month} onChange={handleInputChange} />


                                            </div>
                                        </div> */}
                                        <div className="col-lg-2">
                                            <div className="form_box mb-3">

                                                <a className={`red_button ${loadingCursor ? "loading" : ""}`} onClick={() => { setLoadingCursor(true), onFilterSubmit() }}>Submit</a>&nbsp;
                                                <a className="red_button" onClick={() => resetFilter()}>Reset</a>&nbsp;
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="row mb-5">
                            <div className="col-lg-12">

                                <div className="compony_payrolle_mainbox">
                                    <div className='shortcut_list_repet'  >
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <div className="shortcut_list" style={{ backgroundColor: "#ff577a" }}>
                                                    <div className="col-lg-10 shortcut_heading" >Total Employees</div>
                                                    <div className="col-lg-10 shortcut_heading" >{totalPayrollData?.totalEmployees}</div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="shortcut_list" style={{ backgroundColor: "#fab329" }}>
                                                    <div className="col-lg-10 shortcut_heading" >Total Salary Expences</div>
                                                    <div className="col-lg-10 shortcut_heading" >{totalPayrollData?.totalExpensePay}</div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="shortcut_list" style={{ backgroundColor: "#469de9" }}>
                                                    <div className="col-lg-10 shortcut_heading" >Total Deductions</div>
                                                    <div className="col-lg-10 shortcut_heading" >{totalPayrollData?.totalDeductions}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-lg-12 mt-5">
                                <div className="grey_box" style={{ backgroundColor: "#fff" }}>
                                    <div className="row list_label mb-4">
                                        <div className="col-lg-2 text-center"><div className="label">Emp ID</div></div>
                                        <div className="col-lg-3 text-center"><div className="label">Employee Name</div></div>
                                        <div className="col-lg-2 text-center"><div className="label">Gross Salary</div></div>
                                        <div className="col-lg-2 text-center"><div className="label">Net Salary</div></div>
                                        <div className="col-lg-2 text-center"><div className="label">Total Deductions</div></div>
                                    </div>
                                    {empPayrollData.length > 0 && empPayrollData.map((payroll) =>
                                        <div className="list_listbox" key={payroll.customer_id}>
                                            <div className="list_listing">
                                                <div className="row align-items-center">
                                                    <div className="col-lg-2 text-center">{payroll.emp_id}</div>
                                                    <div className="col-lg-3 text-center">{payroll.emp_name}</div>
                                                    <div className="col-lg-2 text-center">{Number(payroll.gross_salary.toFixed(2))}</div>
                                                    <div className="col-lg-2 text-center">{Number(payroll.net_salary.toFixed(2))}</div>
                                                    <div className="col-lg-2 text-center">{Number(payroll.total_deduction.toFixed(2))}</div>

                                                </div>
                                                <img src={staticIconsBaseURL + "/images/ic_eye.png"} className="img-fluid show-details" alt="Search Icon" style={{ width: "20px" }}
                                                    onClick={() => { showDetailPayrollCustID == payroll.customer_id ? setShowDetailPay(-1) : setShowDetailPay(payroll.customer_id) }}
                                                />
                                            </div>
                                            {showDetailPayrollCustID == payroll.customer_id ?
                                                <div className="list_listing list2">
                                                    <div className='row'>
                                                        <div className="col-lg-6">
                                                            <div className="col-lg-12 text-center1">
                                                                <span className="label">Total working hours:</span> {payroll.total_working_hours}
                                                            </div>
                                                            <div className="col-lg-12 text-center1"><span className="label">Total holidays(in month):</span> {payroll.total_holidays}</div>
                                                            <div className="col-lg-12 text-center1"><span className="label">Total paid leaves:</span> {payroll.total_paid_leaves_days}</div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="col-lg-12 text-center1">
                                                                <span className="label">Total working days:</span> {payroll.total_working_days}
                                                            </div>
                                                            <div className="col-lg-12 text-center1"><span className="label"> Month:</span> {payroll.month}</div>
                                                            <div className="col-lg-12 text-center1"><span className="label">Total unpaid leaves:</span> {payroll.total_unpaid_leaves_days}</div>
                                                        </div>
                                                    </div>
                                                </div> : <></>
                                            }
                                        </div>
                                    )

                                    }
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="page_changer">
                                    {selectedPage > 1 ? <div className="white_button_border_red" onClick={() => { changePage(-1) }}>Prev</div> : <></>}
                                    <div className="font15Medium">{selectedPage}</div>
                                    {hasMoreData && <div className="red_button" onClick={() => { changePage(1) }}>Next</div>}
                                </div>
                            </div>
                        </div>

                    </div>


                </div>


                //  : <LoadingDialog isLoading={true} />
            } />
            {/* </div> */}

            <div>
                <Footer />
            </div>
        </div>
    )
}

export default CompanyPayroll;

async function getEmployees(client_id: any, branchID: any) {

    let query = supabase
        .from('leap_customer')
        .select("customer_id,name,emp_id")
        .eq("client_id", client_id)
    if (branchID) {
        query = query.eq("branch_id", branchID);
    }

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}

async function getBranches(clientID: any) {
    const { data, error } = await supabase.from("leap_client_branch_details")
        .select("id,branch_number")
        .eq("client_id", clientID);
    if (error) {
        return []
    } else {
        return data
    }


}


