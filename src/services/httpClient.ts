const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

export const post = async (
  url: string,
  headers: { [key: string]: string | null } = {},
  body: any
): Promise<any> => {
  const response = await fetch(`${baseURL}${url}`, {
    method: "post",
    headers: headers as Record<string, string>,
    body,
  });

  if (response.status === 200) {
    return await response.json();
  } else {
    throw Error(`Something went wrong: ${response.statusText}`);
  }
};
