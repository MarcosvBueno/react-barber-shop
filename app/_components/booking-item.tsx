import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const BookingItem = () => {
  return (
    <>
      <Card>
        <CardContent className="p-5 flex justify-between py-0">
          <div className="gap-2 flex flex-col py-5">
            <Badge className="bg-[#221C3D] text-primary hover:bg-[#221C3D] w-fit">
              Confirmado
            </Badge>
            <h2 className="font-bold">Corte de Cabelo</h2>
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src="https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png"
                  alt="Avatar"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>

              <h3 className="text-sm">Vintage Barber</h3>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center border-l border-solid border-secondary px-3">
            <p className="text-sm">Fevereiro</p>
            <p className="text-2xl ">18</p>
            <p className="text-sm">09:45</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BookingItem;
