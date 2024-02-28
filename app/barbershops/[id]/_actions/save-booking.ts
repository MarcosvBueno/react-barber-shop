"use server"

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveBookingProps {
    barbershopId: string;
    serviceId: string;
    userId: string;
    date: Date;
}

const SaveBooking = async(params : SaveBookingProps ) => {
    await db.booking.create({
        data: {
            barbershopId: params.barbershopId,
            serviceId: params.serviceId,
            userId: params.userId,
            date: params.date,

        }
    });
    revalidatePath('/')
    revalidatePath('/bookings')

}
 
export default SaveBooking;