import {Menu} from "lucide-react";

export default function Navbar() {
    return (
        <>
            <div className={'min-h-[65px] w-full border-b flex items-center px-5'}>
                <div className={'border rounded-sm px-2 py-1'}>
                    <Menu />
                </div>
            </div>
        </>
    )
}