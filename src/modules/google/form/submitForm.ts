import axios from 'axios';

export const submitForm = async (formId: string, formEntries: string[]) => {
  const baseUrl = `https://docs.google.com/forms/d/${formId}`;

  const entries = formEntries.join('&');

  const url = `${baseUrl}/formResponse?&submit=Submit?usp=pp_url&${entries}`;

  const validUrl = encodeURI(url);

  return axios.get(validUrl);
};
