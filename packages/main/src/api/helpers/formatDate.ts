function formatDate(date: Date | string): string {
  try {
    if (!(date instanceof Date) && typeof date !== "string")
      throw new Error("Can only format strings or dates");

    const dateToFormat: Date = new Date(date);

    if (dateToFormat instanceof Date && !isNaN(dateToFormat as any)) {
      let dd: string | number = dateToFormat.getDate();
      let mm: string | number = dateToFormat.getMonth() + 1;
      const yyyy = dateToFormat.getFullYear();
      if (dd < 10) dd = `0${dd}`;
      if (mm < 10) mm = `0${mm}`;
      return `${yyyy}-${mm}-${dd}`;
    } else {
      throw new Error("String could not be converted to date");
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default formatDate;
