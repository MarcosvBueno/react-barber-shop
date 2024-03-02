import { ptBR } from "date-fns/locale";
import Header from "../_components/header";
import { format, isFuture } from "date-fns";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershop, confirmedBookings] = await Promise.all([
    await db.barbershop.findMany({}),
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
    <div>
      <Header />
      <div className="px-5 pt-5">
        <h2 className="font-bold text-xl ">{session?.user ? `Olá, ${session.user.name?.split(" ")[0]}` : "Olá vamos agendar um corte hoje!!"}</h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE', 'd 'de' MMMM ", {
            locale: ptBR,
          })}
        </p>
      </div>
      <div className="px-5 mt-6">
        <Search />
      </div>
      <div className="mt-6">
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
      <div className="mt-6">
        <h2 className="px-5 text-sm uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>
        <div className=" px-5 flex flex-row gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershop.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
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
        {barbershop.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
                <BarbershopItem  barbershop={barbershop} />
            </div>
           
          ))}
        </div>
      </div>
    </div>
  );
}
