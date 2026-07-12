export const parseFeatureInput = (value: string) => {
  return value
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean);
};

export const getNullableTextValue = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  return trimmedValue;
};
