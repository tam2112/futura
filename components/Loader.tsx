export default function Loader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
            <div className="pyramid-loader">
                <div className="wrapper">
                    <span className="side side1"></span>
                    <span className="side side2"></span>
                    <span className="side side3"></span>
                    <span className="side side4"></span>
                    <span className="shadow"></span>
                </div>
            </div>
        </div>
    );
}
