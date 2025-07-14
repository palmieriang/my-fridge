export const getImageBlobAndMetadata = async (uri: string) => {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error(`Failed to fetch resource: ${response.statusText}`);
  }
  const blob = await response.blob();
  const metadata = { contentType: "image/jpeg" };

  return { blob, metadata };
};
