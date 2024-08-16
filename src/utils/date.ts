import 'dayjs/locale/zh-cn';

import dayjs from 'dayjs';
import duration, { type DurationUnitType } from 'dayjs/plugin/duration';
dayjs.extend(duration);

dayjs.locale('zh-cn');

export { dayjs };
/**
 * 日期格式化
 * @param {string | Date} date 日期
 * @param {string} fmt 格式
 */
export function fmtDate(
  date: string | Date = new Date(),
  fmt = 'YYYY-MM-DD HH:mm:ss',
) {
  if (!date) {
    return '-';
  }
  return dayjs(date).format(fmt);
}

/**
 * 日期时间差
 * @param endTime 结束时间
 * @param startTime 开始时间
 */
export function getDuration(endTime: any, startTime: any) {
  // @ts-ignore
  const duration = dayjs.duration(dayjs(endTime) - dayjs(startTime));

  const day = duration.days();
  const hour = duration.hours();
  const minute = duration.minutes();
  const second = duration.seconds();

  return {
    duration,
    day,
    hour,
    minute,
    second,
  };
}

/**
 * 时间差格式化
 * @param duration
 * @param unit
 * @param fmt
 */
export function fmtDuration(
  duration: number,
  unit: DurationUnitType = 'seconds',
  fmt = 'HH:mm:ss',
) {
  return dayjs.duration(duration, unit).format(fmt);
}
