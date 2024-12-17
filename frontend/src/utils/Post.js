export const Post = async (url, options) => {
  let data = {};
  let response;

  try {
      response = await fetch(url, options);

      // Check if the response is JSON
      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format. Expected JSON.");
      }

      // Parse JSON only if valid
      data = await response.json();
  } catch (error) {
      throw new Error(error.message || "An error occurred");
  }

  if (!response?.ok) {
      throw new Error(data.message || "An error occurred");
  }

  return data;
};
