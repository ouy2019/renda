import axios from 'axios';
// post封装
var doMain = "http://192.168.1.152:9754/";
function post(url, data = {}) {
  console.log(data)
  return new Promise((resolve, reject) => {
    axios.post(doMain + url, data)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}
// get封装
function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    // console.log(doMain+url)
    axios.get(doMain + url, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * delete
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 */
function del(url, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(doMain + url, {
      data: data,
      headers: headers
    })
      .then(res => {
        resolve(res.data);
      }, err => {
        reject(err.response)

      })

  });
}
export default {
  del,
  get,
  post
}