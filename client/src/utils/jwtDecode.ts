// File content copied from https://github.com/morganpage/jwt-pg
const b64DecodeUnicode = (str: string) =>
  decodeURIComponent(
    atob(str).replace(/(.)/g, function (_, p) {
      let code = p.charCodeAt(0).toString(16).toUpperCase();

      if (code.length < 2) {
        code = "0" + code;
      }

      return "%" + code;
    })
  );

const base64_url_decode = (str: string) => {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");

  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};

export const jwtDecode = (token: string, options?: { header: boolean }) => {
  const pos = options?.header === true ? 0 : 1;

  try {
    return JSON.parse(base64_url_decode(token.split(".")[pos]));
  } catch (e) {
    const error = e as { message: string };
    console.log(error.message);
  }
};
