export const getImageBlobAndMetadata = async (_uri: string) => {
  const metadata = { contentType: "image/jpeg" };
  return { metadata };
};
