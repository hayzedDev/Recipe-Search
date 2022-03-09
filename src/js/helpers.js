import { TIMEOUT_SEC } from './config';

// Promisifying callBacks
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // Two promises being awaited simultaneously and the fastest one got accepted and the other got rejected

    console.log('New updates');
    console.log(res);
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      console.log(data.message);
      throw new error(`${data.message}`);
    }
    return data;
  } catch (err) {
    throw `${err} ❤`;
    // console.log(err);
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = ;
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // Two promises being awaited simultaneously and the fastest one got accepted and the other got rejected

//     console.log(res);
//     const data = await res.json();
//     if (!res.ok) throw new error(`${data.message}`);
//     return data;
//   } catch (err) {
//     throw `${err} ❤❤`;
//     // console.log(err);
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     console.log(55);
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

// };
