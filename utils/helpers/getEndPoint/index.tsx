/* eslint-disable import/prefer-default-export */
export const getEndpoint = (url: string): string => {
  if (!url) return '/';

  const cleanUrl: any = url.split('?')[0];
  const match: RegExpMatchArray | null = cleanUrl.match(/\/?([^/]+)\/?$/);

  return match ? `/${match[1]}` : '/';
};
