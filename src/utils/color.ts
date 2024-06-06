/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 * @param   String  color   十六进制颜色值
 * @return  Boolean
 */
export const isHexColor = (color: string) => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/;
  return reg.test(color);
};
/**
 * RGB 颜色值转换为 十六进制颜色值.
 * r, g, 和 b 需要在 [0, 255] 范围内
 *
 * @return  String          类似#ff00ff
 * @param r
 * @param g
 * @param b
 */
export const rgbToHex = (r: number, g: number, b: number) => {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
};

/**
 * HEX格式转换为RGB
 * @param {string} hex 需要转换的颜色值
 * @returns 转换后的值
 */
export const hexToRGB = (hex: string, opacity?: number) => {
  let sHex = hex.toLowerCase();
  if (isHexColor(hex)) {
    if (sHex.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1));
      }
      sHex = sColorNew;
    }
    const sColorChange: number[] = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2)));
    }
    return opacity
      ? 'RGBA(' + sColorChange.join(',') + ',' + opacity + ')'
      : 'RGB(' + sColorChange.join(',') + ')';
  }
  return sHex;
};

export const colorIsDark = (color: string) => {
  if (!isHexColor(color)) return;
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map((item) => Number(item));
  return r * 0.299 + g * 0.578 + b * 0.114 < 192;
};

/* 将百分比添加到十六进制颜色(RR、GG或BB)中，使其更加清晰 */
/**
 * 将百分比求和为HEX颜色的R, G或B
 * @param {string} color 需要转换的值
 * @param {number} amount 数值量
 * @returns {string} 转换后的值
 */
const addLight = (color: string, amount: number) => {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
};
/**
 * 根据百分比将HEX颜色变浅
 * @param {string} color 需要转换的值
 * @param {number} amount 改变颜色的量
 * @returns {string} 处理后的HEX颜色
 */
export const lighten = (color: string, amount: number) => {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount,
  )}${addLight(color.substring(4, 6), amount)}`;
};

/**
 * 混合颜色
 *
 * @param {string} color1 - 第一个颜色, `#`开头的十六进制值.
 * @param {string} color2 - 第一个颜色, `#`开头的十六进制值.
 * @param {number} [weight=0.5] - 权重 0到1之间的数字
 * @returns {string} 混合后的颜色值.
 */
export const mix = (
  color1: string,
  color2: string,
  weight: number = 0.5,
): string => {
  let color = '#';
  for (let i = 0; i <= 2; i++) {
    const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16);
    const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16);
    const c = Math.round(c1 * weight + c2 * (1 - weight));
    color += c.toString(16).padStart(2, '0');
  }
  return color;
};
