import React, { Fragment } from "react";
import { useRouter } from "next/router";
import { getFilteredEvents } from "../../helpers/api-util";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";

export default function FilteredEventsPage(props) {
  const router = useRouter();
  // const filterData = router.query.slug;
  // //console.log(filterData);

  // if (!filterData) {
  //   return <p className="center">Loading...</p>;
  // }

  const filteredYear = props.date.year;
  const filteredMonth = props.date.month;

  if (props.hasError) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = props.events;

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>

        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(filteredYear, filteredMonth - 1);

  return (
    <Fragment>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;

  const filterData = params.slug;

  const filteredYear = parseInt(filterData[0]);
  const filteredMonth = parseInt(filterData[1]);

  if (
    isNaN(filteredYear) ||
    isNaN(filteredMonth) ||
    filteredYear > 2030 ||
    filteredYear < 2021 ||
    filteredMonth > 12 ||
    filteredMonth < 1
  ) {
    return {
      props: { hasError: true },
      // notFound : true,
      // redirect : {
      //   destination : '/error'
      // }
    };
  }

  const filteredEvents = await getFilteredEvents({
    year: filteredYear,
    month: filteredMonth,
  });

  return {
    props: { 
      events : filteredEvents,
      date : {
        year : filteredYear,
        month : filteredMonth
      }
    }
  };
}
