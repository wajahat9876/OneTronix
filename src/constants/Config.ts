export const dev = __DEV__;
// https://api.eccmoney.co.uk/api/v1/ productionLink
export default {
  baseURL: dev
    ? "https://api.onetronix.net/api/v1/"
    : "https://api.onetronix.net/api/v1/",
  baseURL2: dev
    ? "https://devapi.eccmoney.co.uk/api/v2/"
    : "https://devapi.eccmoney.co.uk/api/v2/",

  packages: {
    personal: {
      easy: {
        id: dev ? 27 : 90,
      },
      easyPlus: {
        id: dev ? 28 : 84,
      },
    },
    business: {
      easyBusiness: {
        id: dev ? 22 : 86,
      },
      easyBusinessPlus: {
        id: dev ? 23 : 87,
      },
      easyCorporate: {
        id: dev ? 24 : 88,
      },
      commercialPlatinum: {
        id: dev ? 25 : 89,
      },
    },
  },
};
