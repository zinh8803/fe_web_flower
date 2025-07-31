import api from './api';

export const getDashboardStats = (startDate = '', endDate = '') => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    console.log('Calling API with params:', params); // Debug

    return api.get('/admin/dashboard/statistics', {
        params,
        withCredentials: true,
        // Tắt cache
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });
};
export const exportStatistics = (startDate = '', endDate = '') => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return api.get('/admin/dashboard/export', {
        params,
        responseType: 'blob',
        withCredentials: true,
        // Tắt cache
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });
};