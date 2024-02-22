"use client"
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";

const Header = () => {
    const {data} = useSession();

    const handleLoginClick = () =>  signIn("google");
    const handleSingoutClick = () => signOut();

    return ( 
        <Card>
            <CardContent className="p-5 justify-between flex flex-row items-center ">
            <Image src="/logo.svg" alt="logo" width={180} height={120} />
            <Sheet>
                <SheetTrigger asChild>
                <Button variant={"outline"} size={"icon"} >
                <MenuIcon size={20} />
            </Button>
                </SheetTrigger>
                <SheetContent className="p-0">
                    <SheetHeader >
                        <SheetTitle className="text-left border-b border-solid border-secondary p-5">Menu</SheetTitle>
                    </SheetHeader>
                {data?.user ?  (
               <div className="flex justify-between px-5 py-6 items-center">
                 <div className="flex flex-row items-center gap-3 ">
                    <Avatar>
                        <AvatarImage src={data.user?.image  ?? ""} alt={data.user?.name ?? ""} />
                    </Avatar>
                    <h2 className="font-bold">{data.user.name}</h2>
                </div>
                <Button variant="secondary" onClick={handleSingoutClick} >
                    <LogOutIcon size={16}/>
                </Button>
               </div>
                ): (
                    <div className="flex flex-col px-5 py-6 gap-3">
                        <div className="flex items-center gap-2">
                            <UserIcon size={20} />
                            <h2 className="font-bold">Olá, faça seu login!</h2>
                        </div>
                        <Button variant="secondary" onClick={handleLoginClick} className="w-full flex justify-start">
                            <LogInIcon size={20} className="m-2"/>
                            Fazer login
                        </Button>
                    </div>
                )}

                <div className="flex flex-col gap-3 px-5 ">
                    <Button variant="outline" className=" flex justify-start" asChild>
                        <Link href="/">
                        <HomeIcon size={20} className="mr-2"/>
                        Inicio
                        </Link>
                    </Button>

                    {data?.user && (
                        <Button variant="outline" className=" flex justify-start" asChild>
                            <Link href="/bookings">
                            <Calendar size={20} className="mr-2"/>
                            Agendamentos 
                            </Link>
                        </Button>
                    )}

                </div>

                </SheetContent>
            </Sheet>
            </CardContent>
            
        </Card>
     );
}
 
export default Header;