import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  title: string;
  image: string;
}
const EventCard = ({ title, image }: EventCardProps) => {
  return (
    <Link href={`/events`}>
      <Image
        src={image}
        alt={title}
        height={300}
        width={410}
        className="poster"
      />
      <p className="title">{title}</p>
    </Link>
  );
};

export default EventCard;
