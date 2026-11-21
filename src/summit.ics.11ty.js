export default class {
  data() {
    return { permalink: "/summit.ics", eleventyExcludeFromCollections: true };
  }
  render(data) {
    const s = data.collections.summits.find((x) => x.data.year == data.site.currentYear).data;
    const d = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const esc = (t) => String(t).replace(/([,;\\])/g, "\\$1");
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Summit for Western Civilization//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:summit-" + s.year + "@summit-for-western-civilization",
      "DTSTAMP:" + d(new Date().toISOString()),
      "DTSTART:" + d(s.startISO),
      "DTEND:" + d(s.endISO),
      "SUMMARY:" + esc(data.site.shortName + ": " + s.title),
      "LOCATION:" + esc(s.location),
      "DESCRIPTION:" + esc(s.subtitle),
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n") + "\r\n";
  }
}
