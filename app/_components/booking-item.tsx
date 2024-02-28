"use client"
import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import Barbershops from "../barbershops/[id]/page";
import { Button } from "./ui/button";
import CancelBooking from "../_actions/cancel-booking";
import { toast } from "./ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ToastAction } from "./ui/toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      barbershop: true;
      service: true;
    };
  }>;
}

const BookingItem = ( {booking} : BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const isBookingConfirmed = isFuture(booking.date);

  const handleCancelClick = async() => {
    setIsDeleteLoading(true);
    try {
      CancelBooking(booking.id);
      toast({
        title: "Reserva cancelada com sucesso!",
        color: "success",
        action: (
          <ToastAction altText="Goto schedule to undo">ok!</ToastAction>
        ),
       })
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleteLoading(false);
    }
  }
  return (
    <>
    <Sheet>
      <SheetTrigger asChild>
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
      </SheetTrigger>

      <SheetContent className="px-0">
        <SheetHeader className="px-5  text-left pb-6 border-b border-solid border-secondary">
            <SheetTitle>Informações da Reserva</SheetTitle>
        </SheetHeader>
            <div className="px-5">
            <div className="relative h-[180px] w-full mt-6">
            <Image src="/barbershop-map.png" fill style={{
              objectFit: "contain",
            }} alt={Barbershops.name}/>

              <div className="w-full absolute bottom-4 left-0 px-5">
              <Card>
                <CardContent className="p-3 flex  gap-2"> 
                <Avatar>
                  <AvatarImage
                    src={booking.barbershop.imageUrl}
                    alt="Avatar"
                  />
                </Avatar> 
                <div>
                  <h2 className="font-bold">{booking.barbershop.name}</h2>
                  <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">{booking.barbershop.address}</h3>
                </div>
                </CardContent>
              </Card>
              </div>

            </div>
            <Badge variant={isBookingConfirmed ? "default" : "outline"} className="w-fit my-3 ">
              {isBookingConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>

            <Card>
                      <CardContent className="p-3 flex flex-col gap-3">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{booking.service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(booking.service.price))}
                          </h3>
                        </div>
                     
                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Data</h3>
                            <h4 className="text-sm">
                              {format(booking.date, "dd 'de' MMMM", { locale: ptBR })}
                            </h4>
                          </div>
                    
                      
                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Horário</h3>
                            <h4 className="text-sm">
                              {format(booking.date, "hh:mm")}
                            </h4>
                          </div>
                     
                        <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Barbearia</h3>
                            <h4 className="text-sm">
                              {booking.barbershop.name}
                            </h4>
                        </div>
                      </CardContent>
            </Card>

                  <SheetFooter className="flex gap-3 w-full mt-6">
                    <SheetClose asChild>
                    <Button className="w-full" variant="secondary">Voltar</Button>
                    </SheetClose>
            
                    
                    <AlertDialog>
                    <AlertDialogTrigger>
                    {isDeleteLoading && (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                    <Button className="w-full" variant="destructive" disabled={!isBookingConfirmed || isDeleteLoading}>Cancelar Reserva</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[90%]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deseja mesmo cancelar essa reserva</AlertDialogTitle>
                        <AlertDialogDescription>
                          Uma vez cancelada, não será possível reverter essa ação.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-row gap-3">
                        <AlertDialogCancel className="w-full mt-0">Voltar</AlertDialogCancel>
                        <AlertDialogAction className="w-full" disabled={isDeleteLoading} onClick={handleCancelClick}>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  </SheetFooter>
                 
            </div>
            </SheetContent>
    </Sheet>
    </>
  );
};

export default BookingItem;
