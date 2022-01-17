import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";

//import { getFilteredEvents } from "../../helpers/api-util";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";
//const DB_API_URL = process.env.REACT_APP_DB_URL + "/events.json";
const DB_API_URL = process.env.NEXT_PUBLIC_DB_URL + "/events.json";

export default function FilteredEventsPage(props) {
  const [loadedEvents, setLoadedEvents] = useState();
  const router = useRouter();
  const filterData = router.query.slug;
  console.log(filterData);

  console.log("DB_API_URL = ", DB_API_URL);
  const { data, error } = useSWR(DB_API_URL, fetcher);
  // if(error){
  //   console.log("[slug] error = ", error);
  // }

  // if(data){
  //   console.log("[slug] data = ", data);
  // }else{
  //   console.log("no data received from server..");
  // }

  useEffect(() => {
    if (data) {
      const events = [];
      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }
      setLoadedEvents(events);
    }
  }, [data]);

  let pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`A list of filtered events.`}
      />
    </Head>
  );

  if (!loadedEvents) {
    return (
      <Fragment>
        {pageHeadData}
        <p className="center">Loading...</p>;
      </Fragment>
    );
  }

  const filteredYear = parseInt(filterData[0]);
  const filteredMonth = parseInt(filterData[1]);

  pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`All events for ${filteredMonth}/${filteredYear}`}
      />
    </Head>
  );

  if (
    isNaN(filteredYear) ||
    isNaN(filteredMonth) ||
    filteredYear > 2030 ||
    filteredYear < 2021 ||
    filteredMonth > 12 ||
    filteredMonth < 1 ||
    error
  ) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === filteredYear &&
      eventDate.getMonth() === filteredMonth - 1
    );
  });

  //const filteredEvents = props.events; //from SSR

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>

        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  //const date = new Date(props.date.year, props.date.month - 1);
  const date = new Date(filteredYear, filteredMonth - 1);

  return (
    <Fragment>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

// function fetcher(url) {
//   return fetch(url, {
//     headers: {
//       // Authorization: `Bearer ${localStorage.getItem('token')}`,
//       "Content-Type": "application/json",
//     },
//   }).then((response) => response.json());
// }

const fetcher = async url => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

// these is replaced with client side data fetching
// export async function getServerSideProps(context) {
//   const { params } = context;

//   const filterData = params.slug;

//   const filteredYear = parseInt(filterData[0]);
//   const filteredMonth = parseInt(filterData[1]);

//   if (
//     isNaN(filteredYear) ||
//     isNaN(filteredMonth) ||
//     filteredYear > 2030 ||
//     filteredYear < 2021 ||
//     filteredMonth > 12 ||
//     filteredMonth < 1
//   ) {
//     return {
//       props: { hasError: true },
//       // notFound : true,
//       // redirect : {
//       //   destination : '/error'
//       // }
//     };
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: filteredYear,
//     month: filteredMonth,
//   });

//   return {
//     props: {
//       events: filteredEvents,
//       date: {
//         year: filteredYear,
//         month: filteredMonth,
//       },
//     },
//   };
// }
