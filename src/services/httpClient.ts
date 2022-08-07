const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

export const post = async (
  url: string,
  query:
    | {
        paperWidth?: string;
        paperHeight?: string;
        color?: string;
      }
    | undefined = undefined,
  headers: { [key: string]: string | null } = {},
  body: any
): Promise<any> => {
  const uri = query
    ? `${baseURL}${url}?` + new URLSearchParams(query)
    : `${baseURL}${url}`;
  const response = await fetch(uri, {
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
