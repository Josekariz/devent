import EventCard from "@/components/EventCard";
import ExplorerBtn from "@/components/ExplorerBtn";
import { events } from "@/lib/constants";

const page = () => {
  return (
    <section>
      <h1 className="text-center">Welcome to Devent</h1>
      <p className="text-center mt-5">All your Meetups all in one place</p>
      <ExplorerBtn />
      <div className="mt-20">
        <h3 className="events">Prime Events </h3>
        <ul className="events">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
