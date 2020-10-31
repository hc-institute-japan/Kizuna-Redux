export const dateToMilli = (date: Date) => date.getTime();

export const getTimestamp = () => Math.floor(Date.now() / 1000);

export const getP2PInstanceId = (creator: string, conversant: string): string => `p2p-instance-${creator}-${conversant}`;

export const getP2PDnaId = (creator: string, conversant: string): string => `p2p-dna-${creator}-${conversant}`;