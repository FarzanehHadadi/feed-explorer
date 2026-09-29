const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatPostDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
