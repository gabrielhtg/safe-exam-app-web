import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
      <>
        <Button asChild={true}>
          <Link href="/login">Login</Link>
        </Button>
      </>
  );
}
