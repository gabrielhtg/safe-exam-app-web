import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>

        <div
          className={
            "relative w-full h-screen flex justify-center items-center"
          }
        >
          <Card className={"w-[380px] px-5"}>
            <CardHeader>
              <CardTitle className={"text-2xl text-center mb-3"}>
                Safe Exam Register
              </CardTitle>
              <CardDescription className={"text-center"}>
                Created by TA-12 IF 21
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Input
                id={"input-name"}
                type={"text"}
                className={"mb-3"}
                placeholder={"Name"}
              ></Input>
              <Input
                id={"input-username"}
                type={"text"}
                className={"mb-3"}
                placeholder={"Username"}
              ></Input>
              <Input
                id={"input-email"}
                type={"text"}
                className={"mb-3"}
                placeholder={"Email"}
              ></Input>
              <Input
                id={"input-password"}
                type={"password"}
                className={"mb-3"}
                placeholder={"Password"}
              ></Input>
              <Input
                id={"input-reenter-password"}
                type={"password"}
                className={"mb-3"}
                placeholder={"Confirm Password"}
              ></Input>
            </CardContent>

            <CardFooter className={"gap-x-3 flex-col items-start"}>
              <div className="flex gap-x-3 w-full">
                <Button id="button-register" className="w-full">
                  Register
                </Button>
                <Button
                  asChild={true}
                  id="button-login"
                  className="w-full"
                  variant="secondary"
                >
                  <Link href={"/login"}>Login</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
    </>
  );
}
