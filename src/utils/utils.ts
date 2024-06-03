/**
 * 把对象转为formData
 */
export const objToFormData = (obj: Recordable) => {
  const formData = new FormData();
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key]);
  });
  return formData;
};
