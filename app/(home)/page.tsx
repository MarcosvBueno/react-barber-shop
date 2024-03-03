import { ptBR } from "date-fns/locale";
import Header from "../_components/header";
import { format, isFuture } from "date-fns";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershop,recommendedBarbershops, confirmedBookings] = await Promise.all([
    await db.barbershop.findMany({}),
    await db.barbershop.findMany({
      orderBy: {
        id: "asc",
      }
    }),
    session?.user
      ? await db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            barbershop: true,
            service: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <>
      <div className=" lg:w-full lg:h-[450px] lg:bg-cover lg:-z-10 lg:relative saturate-0 brightness-[.35] " style={{backgroundImage: "url(/banner-barbershop.jpeg)"}}></div>

      <div className="lg:container">
     
      <div className="lg:absolute lg:top-40  lg:z-10">

      <div className="px-5 pt-5">
        <h2 className="font-bold text-xl lg:text-2xl">{session?.user ? `Olá, ${session.user.name?.split(" ")[0]}` : "Olá vamos agendar um corte hoje!!"}</h2>
        <p className="capitalize text-sm lg:text-xl">
          {format(new Date(), "EEEE', 'd 'de' MMMM ", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="mt-6 lg:w-[600px]">
        {confirmedBookings.length > 0 && (
          <>
            <h2 className=" pl-5 text-sm uppercase text-gray-400 font-bold mb-3">
              Agendamentos
            </h2>
            <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden px-5 mt-6">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}
       
      </div>
      
      </div>


      
      <div className="mt-6 ">
        <h2 className="px-5 text-sm uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>
        <div className=" px-5 flex flex-row gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershop.map((barbershop) => (
            <div key={barbershop.id} className="sm:min-w-[167px] sm:max-w-[167px] md:min-w-[237px]  md:max-w-[237px] max-w-[167px] min-w-[167px] w-full">
                <BarbershopItem  barbershop={barbershop} />
            </div>
           
          ))}
        </div>
      </div>
      <div className="mt-6 mb-[4.5rem]">
        <h2 className="px-5 text-sm uppercase text-gray-400 font-bold mb-3">
          Populares
        </h2>
        <div className=" px-5 flex flex-row gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {recommendedBarbershops.map((barbershop) => (
            <div key={barbershop.id} className=" sm:min-w-[167px] sm:max-w-[167px] md:min-w-[237px]  md:max-w-[237px] max-w-[167px] min-w-[167px] w-full">
                <BarbershopItem  barbershop={barbershop} />
            </div>
           
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
