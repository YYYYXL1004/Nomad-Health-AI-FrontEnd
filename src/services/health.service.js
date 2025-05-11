import { request } from '../utils/request';
import { CONFIG } from '../utils';
import { THealthReport, TApiResponse } from '../types/index';

// 健康服务
class HealthService {
  // 获取文章列表
  getArticles(params = {}) {
    return request({
      url: '/api/articles',
      method: 'GET',
      data: params
    });
  }
  
  // 获取文章详情
  getArticleDetail(articleId) {
    return request({
      url: `/api/articles/${articleId}`,
      method: 'GET'
    });
  }
  
  // 获取健康资讯列表
  getTips(params = {}) {
    return request({
      url: '/api/health/tips',
      method: 'GET',
      data: params
    });
  }
  
  // 获取健康报告列表
  getReports(page = 1, limit = 10) {
    return request({
      url: '/api/health/reports',
      method: 'GET',
      data: { page, limit }
    });
  }
  
  // 获取健康报告详情
  getReportDetail(reportId) {
    return request({
      url: `/api/health/reports/${reportId}`,
      method: 'GET'
    });
  }
  
  // 获取健康建议
  getHealthAdvice(type) {
    return request({
      url: '/api/health/advice',
      method: 'GET',
      data: type ? { type } : {}
    });
  }
  
  // 按类别获取健康文章
  getArticlesByCategory(category, page = 1, limit = 10) {
    return request({
      url: '/api/health/articles',
      method: 'GET',
      data: { category, page, limit }
    });
  }
  
  // 搜索健康文章
  searchArticles(keyword, page = 1, limit = 10) {
    return request({
      url: '/api/health/articles/search',
      method: 'GET',
      data: { keyword, page, limit }
    });
  }
}

export const healthService = new HealthService(); 