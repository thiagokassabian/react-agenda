import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material"
import { ICalendar } from "../services/actions"

interface ICalendarsViewProps {
	calendars: ICalendar[]
	toggleCalendar: (i: number) => void
	calendarsSelected: boolean[]
}

const CalendarsView = (props: ICalendarsViewProps) => {
	const { calendars, toggleCalendar, calendarsSelected } = props

	return (
		<Box marginTop={5}>
			<FormGroup>
				{calendars.map((calendar, i) => (
					<FormControlLabel
						key={calendar.id}
						control={<Checkbox onChange={() => toggleCalendar(i)} checked={calendarsSelected[i]} />}
						label={calendar.name}
					/>
				))}
			</FormGroup>
		</Box>
	)
}

export default CalendarsView
