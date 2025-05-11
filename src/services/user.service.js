import { request } from '../utils/request';
import { CONFIG } from '../utils';
import { TUserInfo, TApiResponse } from '../types/index';

// 用户服务
class UserService {
  // 获取用户资料
  getProfile() {
    return request({
      url: '/api/user/profile',
      method: 'GET'
    });
  }
  
  // 更新用户资料
  updateProfile(userData) {
    return request({
      url: '/api/user/profile',
      method: 'PUT',
      data: userData
    });
  }
  
  // 上传头像
  uploadAvatar(filePath) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: CONFIG.API.BASE_URL + '/api/upload/image',
        filePath: filePath,
        name: 'image',
        formData: {
          type: 'avatar'
        },
        header: {
          'Authorization': `Bearer ${uni.getStorageSync(CONFIG.STORAGE.TOKEN)}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data);
            resolve(data);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  
  // 获取系统设置
  getSettings() {
    return request({
      url: '/api/settings',
      method: 'GET'
    });
  }
  
  // 更新系统设置
  updateSettings(settings) {
    return request({
      url: '/api/settings',
      method: 'PUT',
      data: settings
    });
  }
  
  // 保存用户信息到本地存储
  saveUserInfoToStorage(userInfo) {
    uni.setStorageSync(CONFIG.STORAGE.USER_INFO, userInfo);
  }
  
  // 从本地存储获取用户信息
  getUserInfoFromStorage() {
    return uni.getStorageSync(CONFIG.STORAGE.USER_INFO) || null;
  }
}

export const userService = new UserService(); 