import { db } from "@/app/_lib/prisma";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
interface BarbershopsProps {
  params: {
    id?: string;
  };
}

const Barbershops = async ({ params }: BarbershopsProps) => {
  const session = await getServerSession(authOptions);
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
        <div className="px-5 flex flex-col gap-4 py-6 lg:container lg:grid lg:grid-cols-2">
        {services.map((service) => (
                <ServiceItem key={service.id} barbershop={barbershop} service={service} isAuthenticated={!!session?.user} />
            ))}
        </div>
    </div>
);
};

export default Barbershops;
