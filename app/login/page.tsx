"use client"

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
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        router.push("/main");
      }
    } catch (err: any) {
      console.log(err);
      setErrMsg("Login failed. Please check your credentials.");
    }
  }

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
                Safe Exam Login
              </CardTitle>
              <CardDescription className={"text-center"}>
                Created by TA-12 IF 21
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Input
                  id={"input-username"}
                  type={"text"}
                  className={"mb-3"}
                  placeholder={"Username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              ></Input>
              <Input
                  id={"input-password"}
                  type={"password"}
                  placeholder={"Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              ></Input>

              {errMsg && <p className="text-red-500 text-sm mt-2">{errMsg}</p>}
            </CardContent>

            <CardFooter className={"gap-x-3 flex-col items-start"}>
              <div className="flex gap-x-3 w-full">
                <Button onClick={handleLogin} id="button-login" className="w-full">
                  Login
                </Button>
                <Button
                    asChild={true}
                    id="button-register"
                    className="w-full"
                    variant="secondary"
                >
                  <Link href={"/register"}>Register</Link>
                </Button>
              </div>

              <Link
                  href="/password/reset"
                  className="text-sm text-blue-500 hover:underline text-left mt-3"
              >
                Lupa kata sandi?
              </Link>
            </CardFooter>
          </Card>
        </div>
      </>
  );
}
