export const formatTimeAMPM = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

export const formatDateUS = (date) => {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${m}/${d}/${y}`;
};
