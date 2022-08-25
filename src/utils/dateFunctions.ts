export const MONTHS = [
	"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const getToday = (): string => {
	const [isoDate] = new Date().toISOString().split('T');
	return isoDate;
};

export const formatMonth = (isoMonth: string): string => {
	const [year, month] = isoMonth.split('-');
	return `${MONTHS[+month - 1]} de ${year}`;
};

export const addMonths = (month: string, increment: number): string => {
	const jsDate = new Date(month + 'T12:00:00');
	jsDate.setMonth(jsDate.getMonth() + increment);
	return `${jsDate.getFullYear()}-${(jsDate.getMonth() + 1).toString().padStart(2, '0')}`;
};