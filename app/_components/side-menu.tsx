"use client"
import { Avatar, AvatarImage } from "./ui/avatar";
import { LogOutIcon, UserIcon, LogInIcon, HomeIcon, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { useSession,signIn, signOut } from "next-auth/react";
import Link from "next/link";


const SideMenu = () => {
    const {data} = useSession();
    const handleLoginClick = () =>  signIn("google");
    const handleSingoutClick = () => signOut();

    return ( 
        <>
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
        </>
     );
}
 
export default SideMenu;