import { Stack } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { Box } from "@mui/system"
import Button from "@mui/material/Button"
import { AccessTime } from "@mui/icons-material"
import map from "lodash.map"
import { ICalendar, IEvent } from "../services/actions"

const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

export type IEventWithCalendar = IEvent & { calendar: ICalendar }

export interface ICalendarCell {
	date: string
	dayOfMonth: number
	events: IEventWithCalendar[]
}

interface ICalendarProps {
	weeks: ICalendarCell[][]
	onClickDay: (date: string) => void
	onClickEvent: (event: IEvent) => void
}

const Calendar = (props: ICalendarProps) => {
	const { weeks } = props

	const handleClickCell = (e: React.MouseEvent, date: string) => {
		if (e.target === e.currentTarget) props.onClickDay(date)
	}

	return (
		<Table
			aria-label="Agenda"
			sx={{
				flexGrow: 1,
				tableLayout: "fixed",
				borderTop: "1px solid rgba(224, 224, 224, 1)",
				"& td ~ td, & th ~ th": { borderLeft: "1px solid rgba(224, 224, 224, 1)" },
				"& tr:last-child td": { borderBottom: 0 },
				"& td": { verticalAlign: "top" }
			}}
		>
			<TableHead>
				<TableRow>
					{map(daysOfWeek, day => (
						<TableCell key={day} align="center" sx={{ backgroundColor: "rgba(250, 250, 250, 1)" }}>
							{day}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{map(weeks, (week, i) => (
					<TableRow key={i}>
						{map(week, cell => (
							<TableCell padding="normal" align="center" key={cell.date} onClick={e => handleClickCell(e, cell.date)}>
								<div>{cell.dayOfMonth}</div>
								{cell.events.length > 0 && (
									<Stack>
										{cell.events.map(event => {
											const color = event.calendar.color
											return (
												<Button
													sx={{ gap: 2 }}
													size="small"
													key={event.desc}
													variant="text"
													onClick={() => props.onClickEvent(event)}
												>
													{event.time && (
														<Box
															sx={{
																display: "flex",
																alignItems: "center",
																gap: 1
															}}
														>
															<AccessTime sx={{ color: { color } }} /> {event.time}
														</Box>
													)}
													{event.desc}
												</Button>
											)
										})}
									</Stack>
								)}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default Calendar
