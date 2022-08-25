export interface IEvent {
	id?: number;
	date: string;
	desc: string;
	time?: string;
	calendarId: number;
}
export interface ICalendar {
	id: number;
	name: string;
	color: string;
}

const BASE_URL = 'http://localhost:8080';

export const getCalendars = (): Promise<ICalendar[]> => {
	return fetch(`${BASE_URL}/calendars`).then(response => response.json());
};

export const getEvents = (from: string, to: string): Promise<IEvent[]> => {
	return fetch(`${BASE_URL}/events?date_gte=${from}&date_lte=${to}&_sort=date,time`).then(response => response.json());
};

export const createEvent = (event: IEvent): Promise<IEvent> => {
	return fetch(`${BASE_URL}/events`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(event)
	}).then(response => response.json());
};

export const updateEvent = (event: IEvent): Promise<IEvent> => {
	return fetch(`${BASE_URL}/events/${event.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(event)
	}).then(response => response.json());
};

export const deleteEvent = (id: number): Promise<void> => {
	return fetch(`${BASE_URL}/events/${id}`, {
		method: "DELETE"
	}).then(response => response.json());
};