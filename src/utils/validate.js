// 验证手机号
export const isValidPhone = (phone) => {
  if (!phone) return false;
  return /^1[3-9]\d{9}$/.test(phone);
};

// 验证邮箱
export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
};

// 验证密码强度（至少包含数字和字母，长度大于8）
export const isStrongPassword = (password) => {
  if (!password) return false;
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
};

// 验证两次密码是否一致
export const isSamePassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

// 验证是否为空
export const isEmpty = (value) => {
  return value === null || value === undefined || value === '';
};

// 验证身份证号
export const isValidIDCard = (idCard) => {
  if (!idCard) return false;
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
};

// 表单验证
export const validateForm = (formData, rules) => {
  const errors = {};
  
  for (const field in rules) {
    const fieldRules = rules[field];
    const value = formData[field];
    
    for (const rule of fieldRules) {
      if (rule.required && isEmpty(value)) {
        errors[field] = rule.message || '此项不能为空';
        break;
      }
      
      if (rule.validator && !rule.validator(value)) {
        errors[field] = rule.message || '格式不正确';
        break;
      }
      
      if (rule.min && value.length < rule.min) {
        errors[field] = rule.message || `长度不能小于${rule.min}`;
        break;
      }
      
      if (rule.max && value.length > rule.max) {
        errors[field] = rule.message || `长度不能大于${rule.max}`;
        break;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 