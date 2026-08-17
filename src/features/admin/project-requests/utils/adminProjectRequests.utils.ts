export const formatProjectRequestLabel = (value: string) => {
  return value.replaceAll("_", " ");
};

export const formatProjectRequestDate = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};
