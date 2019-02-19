const base = 'http://localhost:8080/api/';
import qwest from 'qwest';

export default {
  get: url => qwest.get(`${base}${url}`, null, { responseType: 'json', withCredentials: true }).then(res => res.response),

  post: (url, data) => qwest.post(`${base}${url}`, data, { dataType: 'json', responseType: 'json', withCredentials: true }).then(res => res.response),

  put: (url, data) => qwest.put(`${base}${url}`, data, { dataType: 'json', responseType: 'json', withCredentials: true }).then(res => res.response),

  upload: (url, data) => qwest.post(`${base}${url}`, data, { dataType: 'formdata', withCredentials: true }).then(res => res.response),

  del: (url, data) => qwest.delete(`${base}${url}`, data, { dataType: 'formdata', withCredentials: true }).then(res => res.response)
};