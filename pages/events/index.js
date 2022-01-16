import React, { Fragment } from 'react';
import { getAllEvents } from '../../helpers/api-util';
import EventList from '../../components/events/event-list';
import EventsSearch from '../../components/events/events-search';
import { useRouter } from 'next/router';

export default function AllEventsPage(props) {
    const router = useRouter();
    const { events } = props;
    //const events = getAllEvents();

    function findEventsHandler(year, month){
        const fullPath = `/events/${year}/${month}`;

        router.push(fullPath)
    }

    return (
        <Fragment>
            <EventsSearch onSearch={findEventsHandler}/>
            <EventList items={events} />
        </Fragment>
    )
}

export async function getStaticProps(){
    const events = await getAllEvents();

    return {
        props : {
            events : events
        },
        revalidate : 60
    }
}
