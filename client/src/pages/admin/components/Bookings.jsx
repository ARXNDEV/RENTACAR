import BookingsTable from "./BookingsTable";
import { Header } from "../components";

const Bookings = () => {
  return (
    <div className="p-10 space-y-8">
      <Header title="Reservation Management" />
      <p className="text-slate-500 font-medium text-sm mt-1 mx-5">Track and update the status of active rentals across your platform.</p>
      <BookingsTable />
    </div>
  );
};

export default Bookings;
