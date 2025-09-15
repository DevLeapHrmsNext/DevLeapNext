// // import React, { useState } from 'react'

// // const DialogFetchedOCRData = ({ onClose, fetchDataArray, onFetch }: { onClose: () => void, onFetch: (selectedData: OCRDataExtractedValues[]) => void, fetchDataArray: OCRDataExtractedValues[] }) => {

// //     const [selectedData, setSelectedData] = useState<OCRDataExtractedValues[]>([])

// //     const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, data: OCRDataExtractedValues) => {
// //         const { checked } = e.target;

// //         setSelectedData((prev) => {
// //           if (checked) {
// //             // Add item
// //             return [...prev, data];
// //           } else {
// //             // Remove item
// //             return prev.filter(
// //               (item) =>
// //                 !(item.component_name === data.component_name && item.value === data.value)
// //             );
// //           }
// //         });
// //       };
// //     return (
// //         <div>
// //             <div className="row">
// //                 <div className="col-lg-12" style={{ textAlign: "right" }}>
// //                     <img src="/images/close.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
// //                         onClick={onClose} />
// //                 </div>
// //             </div>
// //             <div className="row">
// //                 <div className="col-lg-12 mb-4 inner_heading25 text-center">
// //                     Select Data To Fill
// //                 </div>
// //             </div>
// //             <div className="row">
// //                 {fetchDataArray.map((OCRData) =>
// //                     <div>
// //                         <label>
// //                             <input
// //                                 type="checkbox"

// //                                 onChange={(e) => handleFilterChange(e, OCRData)}
// //                             />
// //                             <span style={{ marginLeft: "8px" }}>{OCRData.component_name}:{OCRData.value}</span>
// //                         </label>
// //                     </div>
// //                 )

// //                 }
// //             </div>
// //             <div className="row">
// //                             <div className="col-lg-12" style={{ textAlign: "right" }}><a  className="red_button" onClick={()=>onFetch(selectedData)}>Fill Data</a></div>
// //                         </div>
// //         </div>
// //     )
// // }

// // export default DialogFetchedOCRData

// import React, { useState } from 'react'

// const DialogFetchedOCRData = ({ onClose, fetchDataArray, onFetch }: { onClose: () => void, onFetch: (selectedData: OCRDataExtractedValues[]) => void, fetchDataArray: OCRDataExtractedValues[] }) => {

//     const [selectedData, setSelectedData] = useState<OCRDataExtractedValues[]>([])

//     const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, data: OCRDataExtractedValues) => {
//         const { checked } = e.target;

//         setSelectedData((prev) => {
//           if (checked) {
//             // Add item
//             return [...prev, data];
//           } else {
//             // Remove item
//             return prev.filter(
//               (item) =>
//                 !(item.component_name === data.component_name && item.value === data.value)
//             );
//           }
//         });
//       };
//     return (
//         <div>
//             <div className="row">
//                 <div className="col-lg-12" style={{ textAlign: "right" }}>
//                     <img src="/images/close.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
//                         onClick={onClose} />
//                 </div>
//             </div>
//             <div className="row">
//                 <div className="col-lg-12 mb-4 inner_heading25">
//                     Select Data To Fill
//                 </div>
//             </div>
//             <div className="row">
//                 {fetchDataArray.map((OCRData) =>
//                     <div className='mb-3'>
//                         <label>
//                             <input
//                                 type="checkbox"

//                                 onChange={(e) => handleFilterChange(e, OCRData)}
//                             />
//                             <span style={{ marginLeft: "8px" }}>{OCRData.component_name}:{OCRData.value}</span>
//                         </label>
//                     </div>
//                 )

//                 }
//             </div>
//             <div className="row mt-4">
//                             <div className="col-lg-12"><a  className="red_button" onClick={()=>onFetch(selectedData)}>Fill Data</a></div>
//                         </div>
//         </div>
//     )
// }

// export default DialogFetchedOCRData

import React, { useState } from 'react'
import { ocrComponent_Address, staticIconsBaseURL } from '../pro_utils/stringConstants'

const DialogFetchedOCRData = ({ onClose, fetchDataArray, onFetch }: { onClose: () => void, onFetch: (selectedData: OCRDataExtractedValues[], isPermanantAddress: boolean) => void, fetchDataArray: OCRDataExtractedValues[] }) => {

    const [selectedData, setSelectedData] = useState<OCRDataExtractedValues[]>([])
    const [isPermanent, setIsPermenant] = useState<boolean>(false)
    const [showPermenantCheckBox, setShowPermanentCheckBox] = useState<boolean>(false)

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, data: OCRDataExtractedValues) => {
        const { checked } = e.target;
        if (data.component_name == ocrComponent_Address) {
            setShowPermanentCheckBox(true);
        }
        setSelectedData((prev) => {
            if (checked) {
                // Add item
                return [...prev, data];
            } else {
                // Remove item
                return prev.filter(
                    (item) =>
                        !(item.component_name === data.component_name && item.value === data.value)
                );
            }
        });
    };
    return (
        <div>
            <div className='rightpoup_close' onClick={onClose}>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
            </div>
            <div className="row">
                <div className="col-lg-12 mb-3 inner_heading25">
                    Select Data To Fill
                </div>
            </div>

            <div className="row">
                {fetchDataArray.map((OCRData, index) =>
                    <div className='mb-3' key={index}>
                        <label>
                            <input
                                type="checkbox"

                                onChange={(e) => handleFilterChange(e, OCRData)}
                            />
                            <span style={{ marginLeft: "8px" }}>{OCRData.component_name}:{OCRData.value}</span>
                        </label>
                    </div>
                )

                }
            </div>

            {showPermenantCheckBox && <div className='mb-3' >
                <label>
                    <input
                        type="checkbox"

                        onChange={(e) => setIsPermenant(isPermanent ? false : true)}
                    />
                    <span style={{ marginLeft: "8px" }}>The above address is permanent address.</span>
                </label>
            </div>}
            <div className="row mt-4">
                <div className="col-lg-12"><a className="red_button" onClick={() => {
                    console.log("isPermanent from teh dilog shown ", isPermanent);

                    onFetch(selectedData, isPermanent)
                }}>Fill Data</a></div>
            </div>
        </div>
    )
}

export default DialogFetchedOCRData