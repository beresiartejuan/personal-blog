import Navbar from "./Navbar";

export default function Template({ children }){
    return (
        <div className="bg-slate-300 h-screen overflow-x-hidden overflow-y-auto grid place-content-center">
            <Navbar></Navbar>
            <main>{children}</main>
        </div>
    )
}