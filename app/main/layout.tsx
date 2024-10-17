import Sidebar from "@/components/custom-component/sidebar";

export default function DashboardLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }
) {
    return (
        <>
            <Sidebar></Sidebar>
            <section>{children}</section>
        </>
    )
}