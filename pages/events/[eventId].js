import React, { Fragment } from "react";
//import { useRouter } from "next/router";
import { getEventById, getAllEvents } from "../../helpers/api-util";
import EventSummary from "../../components/event-detail/event-summary";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventContent from "../../components/event-detail/event-content";
import EventAlert from "../../components/ui/error-alert";

export default function EventDetailPage(props) {
  //const router = useRouter();
  //const eventId = router.query.eventId;
  const event = props.selectedEvent; //getEventById(eventId);

  if (!event) {
    return (
      <EventAlert>
        <p>No event found!</p>
      </EventAlert>
    );
  }

  return (
    <Fragment>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;

  const event = await getEventById(eventId);

  return {
    props: {
      selectedEvent: event,
    },
  };
}

export async function getStaticPaths() {
  const events = await getAllEvents();

  const paths = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    paths : paths,
    fallback : false
  };
}
