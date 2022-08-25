import { Typography } from "@mui/material"
import { Box } from "@mui/system"
import { ChevronLeftRounded, ChevronRightRounded, Person } from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"
import Avatar from "@mui/material/Avatar"

import { formatMonth, addMonths } from "../utils/dateFunctions"
import { Link } from "react-router-dom"

interface ICalendarHeaderProps {
	month: string
}

const CalendarHeader = (props: ICalendarHeaderProps) => {
	const { month } = props

	return (
		<Box sx={{ display: "flex", p: 3, gap: 2, alignItems: "center" }}>
			<Box>
				<IconButton aria-label="Mês anterior" component={Link} to={"/calendar/" + addMonths(month, -1)}>
					<ChevronLeftRounded />
				</IconButton>
				<IconButton aria-label="Próximo mês" component={Link} to={"/calendar/" + addMonths(month, 1)}>
					<ChevronRightRounded />
				</IconButton>
			</Box>
			<Typography variant="h5">{formatMonth(month)}</Typography>
			<IconButton aria-label="Usuário" sx={{ marginLeft: "auto" }}>
				<Avatar>
					<Person />
				</Avatar>
			</IconButton>
		</Box>
	)
}

export default CalendarHeader
