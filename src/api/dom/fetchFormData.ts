import axios from 'axios';
import { parse } from 'node-html-parser';

const getBodyTag = (rawHtml: string) => {
  const regex = /<body.*?>(.*?)<\/body>/g;
  const match = rawHtml.match(regex);
  if (match && match[0]) {
    return match[0];
  }
  return '<body></body>';
};

const getFormItemAttributes = (bodyHtml: string) => {
  const root = parse(bodyHtml);
  const formList = root.querySelectorAll('form [role="list"] div[data-params]');
  return formList.map(item => {
    return item.attributes['data-params'];
  });
};

const buildFormUrl = (formId: string) => {
  return `https://docs.google.com/forms/d/${formId}/viewform?edit_requested=true`;
};

export const fetchFormAttributes = async (formId: string) => {
  const res = await axios.get(buildFormUrl(formId));
  const body = getBodyTag(res.data);

  if (body.includes('більше не можна додавати відповіді' || 'is no longer accepting responses')) {
    return null;
  }

  return getFormItemAttributes(body);
};
