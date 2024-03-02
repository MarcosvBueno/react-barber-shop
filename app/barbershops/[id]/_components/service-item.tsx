"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import generateDayTimeList from "./_helpers/hour";
import { addDays, format, setHours, setMinutes } from "date-fns";
import SaveBooking from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { ToastAction } from "@/app/_components/ui/toast";
import { toast } from "@/app/_components/ui/use-toast";
import { useRouter } from "next/navigation";
import GetDayBookings from "../_actions/get-day-bookings";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({
  service,
  barbershop,
  isAuthenticated,
}: ServiceItemProps) => {
  const router = useRouter();
  const { data } = useSession();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>();
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!date) {
      return;
    }

    const refeshAvailableHours = async () => {
      const dayBookings = await GetDayBookings(date, barbershop.id);
      setDayBookings(dayBookings);
    };

    refeshAvailableHours();
  }, [barbershop.id, date]);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const handleHourClick = (time: string) => {
    setHour(time);
    console.log(hour);
  };
  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn();
    }
  };

  const handleBookingSubmit = async () => {
    setIsSubmitLoading(true);
    try {
      if (!date || !hour || !data?.user) {
        return;
      }
      //hour : "09:45"
      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await SaveBooking({
        barbershopId: barbershop.id,
        serviceId: service.id,
        date: newDate,
        userId: (data.user as any).id,
      });
      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      toast({
        title: "Reserva feita com sucesso!",
        description: format(newDate, "'para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: (
          <ToastAction
            onClick={() => router.push("/bookings")}
            altText="Goto schedule to undo"
          >
            Vizualizar
          </ToastAction>
        ),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return generateDayTimeList(date).filter((time) => {
      const dateHour = Number(time.split(":")[0]);
      const dateMinutes = Number(time.split(":")[1]);

      const getBookingDate = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === dateHour && bookingMinutes === dateMinutes;
      });
      if (getBookingDate) {
        return false;
      }
      return true;
    });
  }, [date, dayBookings]);

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex gap-4 items-center">
          <div className="relative h-[110px] w-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              fill
              alt={service.name}
              style={{
                objectFit: "cover",
              }}
              className="rounded-lg"
            />
            <p>{service.name}</p>
          </div>
          <div className="flex flex-col  w-full ">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>
                  <div className="w-full">
                  <Calendar
                      mode="single"
                      footer={false}
                      selected={date}
                      onSelect={handleDateClick}
                      locale={ptBR}
                      fromDate={addDays(new Date(), 1)}
                      className="px-5 py-6 w-full flex items-center justify-center"
                      style={{ width: '100%' }}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          textTransform: "capitalize",
                          width: "100%",
                        },
                        caption: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>
                    
                 

                  {/* Mostrar horarios apenas quando eu tiver uma data selecionada */}
                  {date && (
                    <div className="flex gap-3 px-5 py-6 border-t border-solid border-secondary overflow-x-scroll [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button
                          key={time}
                          className="rounded-full"
                          variant={time === hour ? "default" : "outline"}
                          onClick={() => handleHourClick(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 flex flex-col gap-3">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>
                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Data</h3>
                            <h4 className="text-sm">
                              {format(date, "dd 'de' MMMM", { locale: ptBR })}
                            </h4>
                          </div>
                        )}
                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-sm text-gray-400">Horário</h3>
                            <h4 className="text-sm">{hour}</h4>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <h3 className="text-sm text-gray-400">Barbearia</h3>
                          <h4 className="text-sm">{barbershop.name}</h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <SheetFooter className="px-5">
                    <Button
                      className="w-full"
                      disabled={!date || !hour || isSubmitLoading}
                      onClick={handleBookingSubmit}
                    >
                      {isSubmitLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
