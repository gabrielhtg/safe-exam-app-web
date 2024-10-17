import Sidebar from "@/components/custom-component/sidebar";
import Navbar from "@/components/custom-component/navbar";

export default function DashboardLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }
) {
    return (
        <>
            <Navbar></Navbar>
            <Sidebar></Sidebar>
            <section>{children}</section>
        </>
    )
}