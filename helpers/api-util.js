export async function getAllEvents() {
    const DB_API = process.env.REACT_APP_DB_URL + "/events.json";
    const response = await fetch(DB_API);
    const data = await response.json();
    
    const events = [];

    for (const key in data){
        events.push({
            id : key,
            ...data[key]
        })
    }

    return events;
}

export async function getFeaturedEvents() {
    const allEvents = await getAllEvents();
    return allEvents.filter((event) => event.isFeatured);
}
  
  