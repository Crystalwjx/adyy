import Vue from 'vue';
import picker from '../picker'
let singerpicker = (options = {}) => {
  options = Object.assign({ value: [], title: '请选择' }, options)
  let option = getOption(options.option, options.value);
  return new Promise((resolve, reject) => {
    picker({
      title: options.title,
      value: options.value,
      option: option,
      shadeClose: options.shadeClose,
      change: (value, index, _this) => {
        let newOption = getOption(options.option, value)
        option.splice(0, option.length, ...newOption)
        option.forEach((m, key) => {
          if (key > index) {
            value.push(m[0])
            _this.scrollTop(key, m[0])
          }
        })
        if (typeof options.change == 'function') {
          options.change(value, index, _this)
        }
      }
    }).then((e) => {
      resolve(e)
    }).catch((e) => {
      reject(e)
    })
  })
}

export default singerpicker

function getOption (options, value, arr = []) {
  let len = arr.length, index = options.findIndex(v => v.name == value[len])
  index = index > -1 ? index : 0
  arr[len] = []
  options.forEach((m) => {
    arr[len].push(m.name)
  })
  return arr
}
