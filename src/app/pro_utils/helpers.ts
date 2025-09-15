export const convertCelsiusToFahrenheit = (celsiusTemp: number) => {
    const fahrenheitTemp = ((celsiusTemp * 9) / 5 + 32).toFixed(1);
    return fahrenheitTemp;
  };


  
  export function getStartOfDay(){
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  }
  export function getEndOfDay(){
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
  }

  export function generate16BitAlphanumericToken()  {
    return [...Array(32)]
    .map(() => Math.random().toString(36).charAt(2))
    .join('')
    .toUpperCase();
  };

 export const getWeeksBetweenDates = (startMonth: string, endMonth: string) => {
    const [startYear, startMonthNum] = startMonth.split("-").map(Number);
    const [endYear, endMonthNum] = endMonth.split("-").map(Number);

    // Get the first day of the start month
    const firstDay = new Date(startYear, startMonthNum - 1, 1);
    // Get the last day of the end month
    const lastDay = new Date(endYear, endMonthNum, 0);

    // Calculate the difference in days
    const diffInDays = Math.ceil((lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));

    // Convert days to weeks
    const weeks = Math.ceil(diffInDays / 7);

    return weeks;
};
export const getNumberOfDaysInMonth = (year: any,month:any) => {
  

  return new Date(year, month, 0).getDate();
};

export const getMonthName = (year: any,month:any) => {
  return new Date(year, month - 1).toLocaleString("en-US", { month: "long" });
}