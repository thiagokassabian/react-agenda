import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { MenuItem } from "@mui/material"
import { createEvent, deleteEvent, ICalendar, IEvent, updateEvent } from "../services/actions"
import map from "lodash.map"
import { FormEvent, useEffect, useRef, useState } from "react"

interface IEventFormDialog {
	event: IEvent | null
	calendars: ICalendar[]
	onCancel: () => void
	onSave: () => void
}

interface IValidationErrors {
	[field: string]: string
}

export default function EventFormDialog(props: IEventFormDialog) {
	const { onCancel, calendars, onSave } = props

	const [event, setEvent] = useState<IEvent | null>()
	const [errors, setErrors] = useState<IValidationErrors>({})

	const inputDate = useRef<HTMLInputElement | null>()
	const inputDesc = useRef<HTMLInputElement | null>()

	useEffect(() => {
		setEvent(props.event)
		setErrors({})
	}, [props.event])

	const isNew = !event?.id

	const validate = (): boolean => {
		if (event) {
			const currentErrors: IValidationErrors = {}

			if (!event.date) {
				currentErrors["date"] = "Data deve ser preenchida"
				inputDate.current?.focus()
			}
			if (!event.desc) {
				currentErrors["desc"] = "A descrição deve ser preenchida"
				inputDesc.current?.focus()
			}
			setErrors(currentErrors)

			return Object.keys(currentErrors).length === 0
		}
		return false
	}

	const save = (e: FormEvent) => {
		e.preventDefault()
		if (validate()) {
			if (isNew) createEvent(event!).then(onSave)
			else updateEvent(event!).then(onSave)
		}
	}

	const onDelete = () => {
		deleteEvent(event?.id!).then(onSave)
	}

	return (
		<Dialog open={!!event} onClose={onCancel}>
			<form onSubmit={save}>
				<DialogTitle>{isNew ? "Criar" : "Editar"} evento</DialogTitle>
				<DialogContent>
					{event && (
						<>
							<TextField
								type="date"
								margin="normal"
								label="Data"
								fullWidth
								variant="standard"
								inputRef={inputDate}
								value={event.date}
								onChange={e => setEvent({ ...event, date: e.target.value })}
								error={!!errors.date}
								helperText={errors.date}
							/>
							<TextField
								autoFocus
								margin="normal"
								label="Descrição"
								fullWidth
								variant="standard"
								inputRef={inputDesc}
								value={event.desc}
								onChange={e => setEvent({ ...event, desc: e.target.value })}
								error={!!errors.desc}
								helperText={errors.desc}
							/>
							<TextField
								type="time"
								margin="normal"
								label="Hora"
								fullWidth
								variant="standard"
								value={event.time ?? ""}
								onChange={e => setEvent({ ...event, time: e.target.value })}
							/>

							<TextField
								select
								id="select-calendar"
								margin="normal"
								label="Agenda"
								value={event.calendarId}
								variant="standard"
								sx={{ minWidth: 120 }}
								onChange={e => setEvent({ ...event, calendarId: e.target.value as unknown as number })}
							>
								{map(calendars, calendar => (
									<MenuItem key={calendar.id} value={calendar.id}>
										{calendar.name}
									</MenuItem>
								))}
							</TextField>
						</>
					)}
				</DialogContent>
				<DialogActions>
					{!isNew && <Button onClick={onDelete}>Excluir</Button>}
					<Button onClick={onCancel}>Cancelar</Button>
					<Button type="submit" variant="contained">
						Salvar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}
