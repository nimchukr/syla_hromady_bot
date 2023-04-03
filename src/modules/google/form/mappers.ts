export const mapFieldValueToEntryParam = (fieldValue: { id: string; value: string }) => {
  return `entry.${fieldValue.id}=${fieldValue.value}`;
};
