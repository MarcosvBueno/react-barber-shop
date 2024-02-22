import { Button } from "@/app/_components/ui/button";
import { db } from "@/app/_lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
interface BarbershopsProps {
  params: {
    id?: string;
  };
}

const Barbershops = async ({ params }: BarbershopsProps) => {
  if (!params.id) {
    //TODO: redirect to home
    return null;
  }
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
        services: true,
    },
  });
if (!barbershop) {
    //TODO: redirect to home
    return null;
}

const services = barbershop.services;

return (
    <div>
        <BarbershopInfo barbershop={barbershop} />
        <div className="px-5 flex flex-col gap-4 py-6">
        {services.map((service) => (
                <ServiceItem key={service.id} service={service} />
            ))}
        </div>

    </div>
);
};

export default Barbershops;