export function getGoogleCalendarUrl(
  title: string,
  description: string,
  location: string,
  isoDateTime: string,
  durationHours: number = 4
): string {
  try {
    const startDate = new Date(isoDateTime);
    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

    const formatCalDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      details: description,
      location: location,
      dates: `${formatCalDate(startDate)}/${formatCalDate(endDate)}`
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch {
    return 'https://calendar.google.com';
  }
}

export function downloadIcsFile(
  title: string,
  description: string,
  location: string,
  isoDateTime: string,
  durationHours: number = 4
): void {
  try {
    const startDate = new Date(isoDateTime);
    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

    const formatIcsDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Failed to generate ICS file', e);
  }
}
