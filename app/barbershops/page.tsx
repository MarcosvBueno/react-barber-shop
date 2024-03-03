import { redirect } from "next/navigation";
import BarbershopItem from "../(home)/_components/barbershop-item";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import Search from "../(home)/_components/search";

interface BarbershopsPageProps {
  searchParams?: {
    search?: string;
  };
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
    if(!searchParams?.search) {
        redirect("/");
    }
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams?.search,
        mode: "insensitive",
      },
    },
  });

  return (
    <>
      <div className="lg:container px-5 py-6 flex flex-col gap-6">
      <div className="md:w-1/3">
      <Search defaultValues={{
        Search: searchParams?.search
      }}/>
      </div>
        <h1 className="text-gray-400 font-bold text-xs lg:text-lg lg:text-white uppercase ">
          Resultados para &quot;{searchParams?.search}&quot;
        </h1>
        <div className="grid grid-flow-col mt-3 gap-4 w-full lg:max-w-[500px] ">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="w-full lg:max-w-[300px] ">
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BarbershopsPage;
