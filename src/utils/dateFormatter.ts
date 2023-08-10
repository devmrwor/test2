export function formatDate(dateString: Date): string {
	const date = new Date(dateString);
	const formatter = new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});

	const formattedDate = formatter.format(date).replace(/\//g, '.');
	return formattedDate;
}
