export const handleErrors = (response: Response) => {
  console.log(response);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};
