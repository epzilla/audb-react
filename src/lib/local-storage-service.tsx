export default {
  'prefix': 'audb',

  get: function (key) {
    let prefixedKey, self;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    if (window.localStorage && window.localStorage.getItem) {
      try {
        let item = window.localStorage.getItem(prefixedKey);
        if (item) {
          return JSON.parse(item);
        }
        return null;
      } catch (e) {
        return;
      }
    }
  },

  set: function (key, val) {
    let prefixedKey, self, value;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    value = JSON.stringify(val);
    if (window.localStorage && window.localStorage.setItem) {
      try {
        window.localStorage.setItem(prefixedKey, value);
        return value;
      } catch (e) {
        return value;
      }
    }
  },

  delete: function (key) {
    let prefixedKey, self;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    if (window.localStorage && window.localStorage.removeItem) {
      try {
        window.localStorage.removeItem(prefixedKey);
      } catch (e) {
        return;
      }
    }
  }
};