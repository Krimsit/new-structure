export const guessUserTimeZone = () => new Intl.DateTimeFormat().resolvedOptions().timeZone

export const getLocalTimeZoneOffset = () => -(new Date().getTimezoneOffset() / 60)
