import React from "react";
//import { getFeaturedEvents } from '../dummy-data';
import { getFeaturedEvents } from "../helpers/api-util";
import EventList from "../components/events/event-list";

export default function HomePage(props) {
  //this component will execute after getStaticProps()
  return (
    <div>
      <EventList items={props.events} />
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();
  return {
    props: {
      events: featuredEvents,
    },
    //revalidate : 1800 //every half hour regenerate page
  };
}
