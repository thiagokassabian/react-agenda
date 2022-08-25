import TableContainer from "@mui/material/TableContainer"
import { Box } from "@mui/system"
import Button from "@mui/material/Button"
import { useEffect, useState } from "react"
import { getCalendars, getEvents, ICalendar, IEvent } from "../services/actions"
import { useParams } from "react-router-dom"
import CalendarsView from "../components/CalendarsView"
import CalendarHeader from "../components/CalendarHeader"
import Calendar, { ICalendarCell, IEventWithCalendar } from "../components/Calendar"
import EventFormDialog from "../components/EventFormDialog"
import { getToday } from "../utils/dateFunctions"
import "./styles.scss"

const AgendaPage = () => {
	const { month } = useParams<{ month: string }>()

	const [calendars, setCalendars] = useState<ICalendar[]>([])
	const [calendarsSelected, setCalendarsSelected] = useState<boolean[]>([])
	const [events, setEvents] = useState<IEvent[]>([])
	const [openDialog, setOpenDialog] = useState<IEvent | null>(null)

	const weeks = generateCalendar(`${month}-01`, events, calendars, calendarsSelected)
	const firstDate = weeks[0][0].date
	const lastDate = weeks[weeks.length - 1][6].date

	useEffect(() => {
		Promise.all([getCalendars(), getEvents(firstDate, lastDate)]).then(([calendars, events]) => {
			setCalendarsSelected(calendars.map(() => true))
			setCalendars(calendars)
			setEvents(events)
		})
	}, [firstDate, lastDate])

	const toggleCalendar = (i: number) => {
		const newValue = [...calendarsSelected]
		newValue[i] = !newValue[i]
		setCalendarsSelected(newValue)
	}

	const newEvent = (date: string) => ({
		date,
		desc: "",
		calendarId: calendars[0].id
	})

	const refreshEvents = () => {
		getEvents(firstDate, lastDate).then(setEvents)
	}

	return (
		<>
			<Box sx={{ display: "flex", height: "100%", alignItems: "stretch" }}>
				<Box sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", p: 3, minWidth: 150 }}>
					<Button variant="contained" fullWidth={true} sx={{ marginTop: 2 }} onClick={() => setOpenDialog(newEvent(getToday()))}>
						Novo evento
					</Button>
					<CalendarsView calendars={calendars} toggleCalendar={toggleCalendar} calendarsSelected={calendarsSelected} />
				</Box>
				<TableContainer sx={{ display: "flex", flexDirection: "column" }}>
					<CalendarHeader month={month!} />
					<Calendar onClickDay={date => setOpenDialog(newEvent(date))} onClickEvent={setOpenDialog} weeks={weeks} />
				</TableContainer>
			</Box>
			<EventFormDialog
				event={openDialog}
				onSave={() => {
					setOpenDialog(null)
					refreshEvents()
				}}
				onCancel={() => setOpenDialog(null)}
				calendars={calendars}
			/>
		</>
	)
}

const generateCalendar = (date: string, allEvents: IEvent[], calendars: ICalendar[], calendarsSelected: boolean[]): ICalendarCell[][] => {
	const weeks: ICalendarCell[][] = []
	const jsDate = new Date(`${date}T12:00:00`)
	const currentMonth = jsDate.getMonth()
	const currentDay = new Date(jsDate.valueOf())
	currentDay.setDate(1)
	const dayOfWeek = currentDay.getDay()
	currentDay.setDate(1 - dayOfWeek)

	do {
		const week: ICalendarCell[] = []
		for (let i = 0; i < 7; i++) {
			const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, "0")
			const dayStr = currentDay.getDate().toString().padStart(2, "0")
			const isoDate = `${currentDay.getFullYear()}-${monthStr}-${dayStr}`

			const events: IEventWithCalendar[] = []
			for (const event of allEvents) {
				if (event.date === isoDate) {
					const calendarIndex = calendars.findIndex(c => c.id === event.calendarId)
					if (calendarsSelected[calendarIndex]) {
						events.push({ ...event, calendar: calendars[calendarIndex] })
					}
				}
			}

			week.push({
				dayOfMonth: currentDay.getDate(),
				date: isoDate,
				events
			})
			currentDay.setDate(currentDay.getDate() + 1)
		}
		weeks.push(week)
	} while (currentDay.getMonth() === currentMonth)

	return weeks
}

export default AgendaPage
