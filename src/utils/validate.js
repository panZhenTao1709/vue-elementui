/**
 * Created by jiachenpan on 16/11/18.
 */

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 验证邮箱
 * @param str
 * @returns {boolean}
 */
export function validatEmail(str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  return reg.test(str)
}

/**
 * 验证密码 6-20位  大小写字母数字下划线均可
 * @param  str
 */
export function isvalidatPassword(str) {
  const reg = /^[a-zA-Z0-9]{6,20}$/
  return reg.test(str)
}

/**
 * 验证登录名 username  不能：中文、纯数字、特殊符号   至少4位
 * @param {*} str
 */
export function isvalidatUsername(str) {
  const reg = /^(?![0-9]+$)[0-9A-Za-z_-]{4,}$/
  return reg.test(str)
}

/**
 * 验证身份证
 * @param {} str
 */
export function isvalidatCPcode(str) {
  var reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return reg.test(str)
}

/**
 * 验证手机号
 * @param {*} str
 */

export function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}
/**
 * 验证长度1-20位
 * @param {*} str
 */
export function isOverLength(str) {
  var reg = /^[\s\S]{1,20}$/
  return reg.test(str)
}
/**
 * 验证英文名称
 * @param {*} str
 */
export function isEnname(str) {
  var reg = /^[a-zA-Z\s]{1,30}$/
  return reg.test(str)
}

/**
 * 验证数字
 * @param str
 * @returns {boolean}
 */
export function isNumber(str) {
  var reg = /^[0-9]+$/
  return reg.test(str)
}
export function isPostalcode(str) {
  var reg = /^[0-9]{6}$/
  return reg.test(str)
}

