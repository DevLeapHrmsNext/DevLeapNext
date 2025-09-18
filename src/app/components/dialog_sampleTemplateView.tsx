const SampleTemplateView = ({html,onClose}:{html:string,onClose:()=>void}) => {
    return (
        <div className="loader-overlay">
            <div className="loader-dialog">
                <div dangerouslySetInnerHTML={{ __html: html }} />
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
export default SampleTemplateView;