export const dateToMilli = (date: Date) => date.getTime();

export const getTimestamp = () => Math.floor(Date.now() / 1000);
