"use client"

import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop } from "@prisma/client";
import { ChevronLeftIcon, MenuIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface BarbershopInfoProps {
    barbershop: Barbershop;
}


const BarbershopInfo = ({barbershop} : BarbershopInfoProps) => {
    const router = useRouter();
    const handleBackMenu = () =>{
        router.replace("/");
    }
    return ( 
        <div>
        <div className="h-[256px] w-full relative lg:container">

            <Button onClick={handleBackMenu} size="icon" variant="outline" className="absolute top-4 left-4 z-50 ">
            <ChevronLeftIcon size={24}  />
            </Button>

        <Image src={barbershop.imageUrl} alt={barbershop.name} layout="fill" style={{
            objectFit: "cover"
        }} 
        className="opacity-75 rounded-2xl"/>
        </div>
        <div className="px-5 pt-3 pb-6 border-b border-solid border-primary lg:container">
            <h1 className="font-bold text-2xl">{barbershop.name}</h1>

            <div className="flex items-center gap-1 mt-2">
            <MapPinIcon size={18} className=" text-primary" />
            <p className="text-gray-400 text-sm mt-2">{barbershop.address}</p>
            </div>

            <div className="flex items-center gap-1 mt-2 ">
            <StarIcon size={16} className="fill-primary text-primary" />
            <p className="text-sm mt-2">5.0 (889 avaliações) </p>
            </div>
            <div>

            </div>
        </div>
    </div>
     );
}
 
export default BarbershopInfo;