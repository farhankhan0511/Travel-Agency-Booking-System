export const Post = async (url, options) => {
  let data = {};
  try {
    const response = await fetch(url, options);

    const isJson = response.headers
      ?.get("content-type")
      ?.includes("application/json");

    data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.message || `HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Network or API error occurred.");
  }
  return data;
};
