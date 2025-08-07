/* eslint-disable import/prefer-default-export */
export const getTextAfterFirstHyphen = (text: any) => {
  const index = text.indexOf('-');
  return index !== -1 ? text.substring(index + 1).trim() : text;
};
