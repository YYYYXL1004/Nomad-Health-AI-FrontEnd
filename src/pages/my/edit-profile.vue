<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ $t('my.editProfile') }}</text>
      </view>
      <view class="save-btn" @tap="saveProfile">
        <text>{{ $t('common.save') }}</text>
      </view>
    </view>
    
    <!-- 头像部分 -->
    <view class="avatar-section">
      <view class="avatar-container" @tap="changeAvatar">
        <image class="avatar" :src="form.avatar" mode="aspectFill"></image>
        <view class="avatar-edit-icon">
          <text class="edit-icon">📷</text>
        </view>
      </view>
      <text class="avatar-tip">{{ $t('editProfile.changeAvatar') }}</text>
    </view>
    
    <!-- 表单信息 -->
    <view class="form-container">
      <view class="form-item">
        <text class="form-label">{{ $t('editProfile.nickname') }}</text>
        <input class="form-input" v-model="form.nickname" :placeholder="$t('editProfile.nicknamePlaceholder')" />
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ $t('editProfile.gender') }}</text>
        <view class="gender-selector">
          <view 
            class="gender-option" 
            :class="{ active: form.gender === 'male' }"
            @tap="form.gender = 'male'"
          >
            <text>{{ $t('editProfile.male') }}</text>
          </view>
          <view 
            class="gender-option" 
            :class="{ active: form.gender === 'female' }"
            @tap="form.gender = 'female'"
          >
            <text>{{ $t('editProfile.female') }}</text>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ $t('editProfile.birthday') }}</text>
        <picker 
          mode="date" 
          :value="form.birthday" 
          :start="birthdayRange.start" 
          :end="birthdayRange.end"
          @change="handleBirthdayChange"
          class="date-picker"
        >
          <view class="picker-value">
            <text>{{ form.birthday || $t('editProfile.selectDate') }}</text>
            <text class="arrow-icon">›</text>
          </view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ $t('editProfile.phone') }}</text>
        <input 
          class="form-input" 
          v-model="form.phone" 
          type="number" 
          maxlength="11" 
          :placeholder="$t('editProfile.phonePlaceholder')" 
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ $t('editProfile.email') }}</text>
        <input 
          class="form-input" 
          v-model="form.email" 
          type="text" 
          :placeholder="$t('editProfile.emailPlaceholder')" 
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ $t('editProfile.address') }}</text>
        <textarea 
          class="form-textarea" 
          v-model="form.address" 
          :placeholder="$t('editProfile.addressPlaceholder')"
          maxlength="100"
        ></textarea>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';
import { getBaseUrl, getGlobalRequest } from '@/utils/platform.js';

// 用户信息
const form = ref({
  avatar: '/src/static/images/default-avatar.jpg',
  nickname: '',
  gender: 'male',
  birthday: '',
  phone: '',
  email: '',
  address: '',
  height: '',
  weight: ''
});

// 生日可选范围
const birthdayRange = reactive({
  start: '1900-01-01',
  end: new Date().toISOString().split('T')[0] // 当前日期
});

// 页面加载时获取用户信息
onMounted(() => {
  // 获取存储的用户信息
  const storedUserInfo = uni.getStorageSync('userInfo');
  if (storedUserInfo) {
    // 合并存储的信息，保留默认值
    form.value = {
      ...form.value,
      ...storedUserInfo
    };
  }
  
  // 如果性别未设置，默认设置为男性
  if (!form.value.gender) {
    form.value.gender = 'male';
  }
  
  // 获取当前语言
  const lang = getCurrentLang();
  console.log('Current language:', lang);
});

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 处理生日选择
const handleBirthdayChange = (e) => {
  form.value.birthday = e.detail.value;
};

// 更换头像
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths;
      // 设置新头像的临时路径
      form.value.avatar = tempFilePaths[0];
      
      // 预加载图片确保显示正常
      uni.getImageInfo({
        src: tempFilePaths[0],
        success: (res) => {
          console.log('头像图片预加载成功');
        },
        fail: (err) => {
          console.error('头像图片预加载失败', err);
          // 预加载失败时使用默认头像
          form.value.avatar = '/src/static/images/default-avatar.jpg';
        }
      });
    }
  });
};

// 保存用户信息
const saveProfile = () => {
  // 表单验证
  if (!form.value.nickname || form.value.nickname.trim() === '') {
    uni.showToast({
      title: getCurrentLang() === 'zh' ? '请输入昵称' : 'Нэрээ оруулна уу',
      icon: 'none'
    });
    return;
  }
  
  // 手机号验证
  if (form.value.phone && !/^1\d{10}$/.test(form.value.phone)) {
    uni.showToast({
      title: getCurrentLang() === 'zh' ? '请输入正确的手机号' : 'Зөв утасны дугаар оруулна уу',
      icon: 'none'
    });
    return;
  }
  
  // 邮箱验证
  if (form.value.email && !/^[\w.-]+@[\w.-]+\.\w+$/.test(form.value.email)) {
    uni.showToast({
      title: getCurrentLang() === 'zh' ? '请输入正确的邮箱' : 'Зөв имэйл хаяг оруулна уу',
      icon: 'none'
    });
    return;
  }
  
  // 显示加载提示
  uni.showLoading({
    title: getCurrentLang() === 'zh' ? '保存中...' : 'Хадгалж байна...'
  });
  
  // 检查是否更换了头像
  if (form.value.avatar && form.value.avatar.startsWith('http')) {
    // 头像未更改，直接调用更新信息API
    updateUserInfo();
  } else if (form.value.avatar && form.value.avatar.startsWith('/')) {
    // 头像已更改，需要先上传头像
    uploadAvatar();
  } else {
    // 没有头像，直接更新信息
    updateUserInfo();
  }
};

// 上传头像
const uploadAvatar = () => {
  // 获取基础URL
  const baseUrl = getBaseUrl();

  uni.uploadFile({
    url: baseUrl + '/api/upload/image',
    filePath: form.value.avatar,
    name: 'image',
    formData: {
      type: 'avatar'
    },
    header: {
      'Authorization': 'Bearer ' + uni.getStorageSync('token')
    },
    success: (uploadRes) => {
      try {
        const data = JSON.parse(uploadRes.data);
        if (data.status === 200 && data.data && data.data.avatarUrl) {
          // 更新头像URL
          form.value.avatar = data.data.avatarUrl;
          // 继续更新用户信息
          updateUserInfo();
        } else {
          uni.hideLoading();
          uni.showToast({
            title: getCurrentLang() === 'zh' ? '头像上传失败' : 'Аватар байршуулж чадсангүй',
            icon: 'none'
          });
        }
      } catch (e) {
        uni.hideLoading();
        uni.showToast({
          title: getCurrentLang() === 'zh' ? '头像上传失败' : 'Аватар байршуулж чадсангүй',
          icon: 'none'
        });
      }
    },
    fail: () => {
      uni.hideLoading();
      uni.showToast({
        title: getCurrentLang() === 'zh' ? '头像上传失败' : 'Аватар байршуулж чадсангүй',
        icon: 'none'
      });
    }
  });
};

// 更新用户信息
const updateUserInfo = () => {
  // 获取全局request方法
  const request = getGlobalRequest();
  
  // 构建完整的用户信息参数（根据API文档)
  const userProfileData = {
    nickname: form.value.nickname,
    gender: form.value.gender,
    avatar: form.value.avatar,
    phone: form.value.phone,
    email: form.value.email,
    address: form.value.address
    // 注意：根据API文档，birthday、height和weight暂不支持
  };
  
  console.log('提交的用户信息：', userProfileData);
  
  // 调用API更新用户信息
  request({
    url: '/api/user/profile',
    method: 'PUT',
    data: userProfileData
  }).then(res => {
    uni.hideLoading();
    
    // 更新本地存储的用户信息
    const updatedUserInfo = {
      ...uni.getStorageSync('userInfo'),
      userId: res.data.userId,
      account: res.data.account,
      username: res.data.nickname, // 用于显示
      nickname: res.data.nickname,
      avatar: res.data.avatar,
      phone: res.data.phone,
      gender: res.data.gender,
      email: res.data.email,
      address: res.data.address,
      // 其他字段可以保存但暂不修改
      birthday: res.data.birthday,
      height: res.data.height,
      weight: res.data.weight,
      created_at: res.data.created_at
    };
    
    uni.setStorageSync('userInfo', updatedUserInfo);
    
    // 触发全局事件，通知"我的"页面更新数据
    uni.$emit('updateUserInfo');
    
    uni.showToast({
      title: getCurrentLang() === 'zh' ? '保存成功' : 'Амжилттай хадгалагдлаа',
      icon: 'success'
    });
    
    // 延迟返回
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }).catch(err => {
    uni.hideLoading();
    
    uni.showToast({
      title: (err.errors && err.errors[0]) || (getCurrentLang() === 'zh' ? '保存失败' : 'Хадгалж чадсангүй'),
      icon: 'none'
    });
  });
};

// 计算年龄
const calculateAge = (birthday) => {
  if (!birthday) return '';
  
  const birthdayDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthdayDate.getFullYear();
  const monthDiff = today.getMonth() - birthdayDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())) {
    age--;
  }
  
  return age.toString();
};

// 加载用户信息
const loadUserInfo = () => {
  // 从本地存储获取最新用户信息
  const storedUserInfo = uni.getStorageSync('userInfo');
  if (storedUserInfo) {
    // 处理头像URL
    let avatarUrl = storedUserInfo.avatar || '/src/static/images/default-avatar.jpg';
    
    // 如果头像URL是blob格式，使用默认头像
    if (avatarUrl && (avatarUrl.startsWith('blob:') || avatarUrl === '')) {
      avatarUrl = '/src/static/images/default-avatar.jpg';
    }
    
    form.value = {
      ...form.value,
      ...storedUserInfo,
      avatar: avatarUrl
    };
  }
  
  // 调用API获取完整用户信息
  userApi.getProfile().then(res => {
    if (res.data) {
      // 处理头像URL
      let avatarUrl = res.data.avatar || form.value.avatar || '/src/static/images/default-avatar.jpg';
      
      // 如果头像URL是blob格式，使用默认头像
      if (avatarUrl && (avatarUrl.startsWith('blob:') || avatarUrl === '')) {
        avatarUrl = '/src/static/images/default-avatar.jpg';
      }
      
      form.value = {
        ...form.value,
        userId: res.data.userId,
        account: res.data.account,
        nickname: res.data.nickname,
        avatar: avatarUrl,
        gender: res.data.gender || form.value.gender,
        birthday: res.data.birthday || form.value.birthday,
        phone: res.data.phone || form.value.phone,
        email: res.data.email || form.value.email,
        address: res.data.address || form.value.address,
        height: res.data.height || form.value.height,
        weight: res.data.weight || form.value.weight
      };
    }
    loading.value = false;
  }).catch(err => {
    console.error('获取用户信息失败', err);
    loading.value = false;
  });
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 导航栏 */
.nav-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90rpx;
  background-color: #8ab6c8;
  padding: 0 30rpx;
}

.back-btn {
  position: absolute;
  left: 30rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8rpx;
}

.back-icon {
  color: #fff;
  font-size: 32rpx;
}

.page-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.save-btn {
  position: absolute;
  right: 30rpx;
  color: #fff;
  font-size: 28rpx;
}

/* 头像部分 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  background-color: #fff;
}

.avatar-container {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  margin-bottom: 20rpx;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
}

.avatar-edit-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50rpx;
  height: 50rpx;
  background-color: #8ab6c8;
  border-radius: 25rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-icon {
  font-size: 26rpx;
  color: #fff;
}

.avatar-tip {
  font-size: 24rpx;
  color: #999;
}

/* 表单部分 */
.form-container {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 0 30rpx;
}

.form-item {
  padding: 30rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.form-input {
  width: 100%;
  height: 70rpx;
  font-size: 28rpx;
  color: #333;
}

.form-textarea {
  width: 100%;
  height: 150rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

/* 性别选择器 */
.gender-selector {
  display: flex;
  margin-top: 10rpx;
}

.gender-option {
  flex: 1;
  height: 70rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  margin-right: 20rpx;
  border-radius: 8rpx;
}

.gender-option:last-child {
  margin-right: 0;
}

.gender-option.active {
  background-color: #8ab6c8;
}

.gender-option.active text {
  color: #fff;
}

.gender-option text {
  font-size: 28rpx;
  color: #666;
}

/* 日期选择器 */
.date-picker {
  width: 100%;
  height: 70rpx;
}

.picker-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70rpx;
}

.picker-value text {
  font-size: 28rpx;
  color: #333;
}

.arrow-icon {
  color: #999;
  transform: rotate(90deg);
  font-size: 30rpx;
}
</style> 