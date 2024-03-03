"use client";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CalendarIcon, LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = () => {
  const {data, status} = useSession();

  async function handleLoginClick() {
    await signIn("google");
  }

  async function handleSingoutClick() {
    await signOut();
  }

  return (
    <Card>
      <CardContent className="p-5 lg:container justify-between flex flex-row items-center ">
       <Link href="/">
       <Image src="/logo.svg" alt="logo" width={130} height={120} />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {status === 'authenticated'
            ? (
              <>
                <Button
                  variant="ghost"
                  className="justify-normal gap-2"
                  asChild
                >
                  <Link href="/bookings">
                    <CalendarIcon size={16} />
                    Agendamentos
                  </Link>
                </Button>

                <div className="flex justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-9">
                      <AvatarImage src={data.user?.image ?? ""} />
                      <AvatarFallback>{data.user?.name}</AvatarFallback>
                    </Avatar>
                    <h2 className="font-bold">{data.user?.name}</h2>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSingoutClick}
                  >
                    <LogOutIcon size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <Button
                className="font-bold gap-2 justify-normal"
                onClick={handleLoginClick}
              >
                <LogInIcon size={16} />
                Fazer Login
              </Button>
            )}
        </div>

        <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MenuIcon size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
