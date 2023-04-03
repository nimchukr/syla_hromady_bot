import axios from 'axios';

export const submitForm = async (formId: string, data: Record<string, any>, fields: { id: string | number; title: string }[]) => {
  const baseUrl = `https://docs.google.com/forms/d/${formId}`;

  const entries = fields
    .map(field => {
      const value = data[field.id];
      if (value || (Array.isArray(value) && value.length === 0)) return '';
      const entry = `entry.${field.id}=${Array.isArray(value) ? value.join(',') : value}`;
      return entry;
    })
    .filter(Boolean)
    .join('&');
  const url = `${baseUrl}/formResponse?&submit=Submit?usp=pp_url&${entries}`;

  const validUrl = encodeURI(url);

  return axios.get(validUrl);
};
