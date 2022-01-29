import React from "react";
import Head from "next/head";
//import { getFeaturedEvents } from '../dummy-data';
import { getFeaturedEvents } from "../helpers/api-util";
import EventList from "../components/events/event-list";
import NewsLetterRegistration from "../components/input/newsletter-registration";

export default function HomePage(props) {
  //this component will execute after getStaticProps()
  return (
    <div>
      <Head>
        <title>NextJS Events</title>
        <meta
          name="description"
          content="Find a lot of great events that allow you to evolve..."
        />
      </Head>
      <NewsLetterRegistration />
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
    revalidate: 1800, //every half hour regenerate page
  };
}
