

export const isDevelopment = () => {
  /**
   * Returns true if app is running locally.
   */
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
}

export const apiUrl = () => {
  return isDevelopment() ? "http://localhost:8050/" : "https://api.zincbind.net/";
}

export const predictUrl = () => {
  return isDevelopment() ? "http://localhost:8051/" : "https://predict.zincbind.net/";
}