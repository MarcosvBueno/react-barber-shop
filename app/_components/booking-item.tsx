import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      barbershop: true;
      service: true;
    };
  }>;
}

const BookingItem = ( {booking} : BookingItemProps) => {
  const isBookingConfirmed = isFuture(booking.date);

  return (
    <>
      <Card className="min-w-full">
        <CardContent className="py-0 flex px-0 ">
          <div className="gap-2 flex flex-col py-5 flex-[3] px-5">
            <Badge variant={isBookingConfirmed ? "default" : "outline"} className="w-fit">
              {isBookingConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>
            <h2 className="font-bold">{booking.service.name}</h2>
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={booking.barbershop.imageUrl}
                  alt="Avatar"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>

              <h3 className="text-sm">{booking.barbershop.name}</h3>
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-center items-center border-l border-solid border-secondary ">
            <p className="text-sm capitalize">{format(booking.date, "MMMM", {
              locale: ptBR,
            })}</p>
            <p className="text-2xl ">{format(booking.date, "dd", {
              locale: ptBR,
            })}</p>
            <p className="text-sm">{format(booking.date, "hh:mm")}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BookingItem;
