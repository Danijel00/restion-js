import { TIMEOUT_SEC } from './config';

// A timeout function for slower connections
const timeoutConnection = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took to long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchData = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const response = await Promise.race([
      fetchData,
      timeoutConnection(TIMEOUT_SEC),
    ]);
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

// * get request
// export const getJSON = async function (url) {
//   try {
//     // const response = await fetch(url);
//     const response = await Promise.race([
//       fetch(url),
//       timeoutConnection(TIMEOUT_SEC),
//     ]);
//     const data = await response.json();
//     if (!response.ok) throw new Error(`${data.message} (${response.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// * Post request
// export const sendJSON = async function (url, uploadData) {
//   try {
// const response = await fetch(url);
//     const postRequest = fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(uploadData),
//     });
//     const response = await Promise.race([
//       postRequest,
//       timeoutConnection(TIMEOUT_SEC),
//     ]);
//     const data = await response.json();
//     if (!response.ok) throw new Error(`${data.message} (${response.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
