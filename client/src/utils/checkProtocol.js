export const checkProtocol = (link) => {
  if (link) {
    const hasHttp = link.indexOf('http://') === 0;
    const hasHttps = link.indexOf('https://') === 0;

    return hasHttp || hasHttps;
  }

  return false;
};
