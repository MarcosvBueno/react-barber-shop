"use server"

import { db } from "@/app/_lib/prisma";

interface SaveBookingProps {
    barbershopId: string;
    serviceId: string;
    userId: string;
    date: Date;
}

const SaveBooking = async(params : SaveBookingProps ) => {
    await db.booking.create({
        data: {
            babershopId: params.barbershopId,
            serviceId: params.serviceId,
            userId: params.userId,
            date: params.date,

        }
    });

}
 
export default SaveBooking;