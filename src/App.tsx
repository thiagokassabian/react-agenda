import AgendaPage from "./pages/AgendaPage"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { getToday } from "./utils/dateFunctions"
import "./App.scss"

function App() {
	const month = getToday().substring(0, 7)

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/calendar/:month" element={<AgendaPage />} />
				<Route path="*" element={<Navigate to={`/calendar/${month}`} replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
