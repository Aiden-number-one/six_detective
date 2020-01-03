/*
 * @Description: 首页相关接口
 * @Author: lan
 * @Date: 2019-11-28 14:18:22
 * @LastEditTime : 2020-01-03 11:06:47
 * @LastEditors  : lan
 */
export default {
  getQuickMenu: 'get_quickly_query_menu', // 获取快捷菜单
  getAllAlterData: 'get_alert_count_group_by_owner', // 获取全部的alert的数据
  getTaskCount: 'get_not_finish_task_count', // 获取任务总数
  getAlertCount: 'get_not_finish_alert_count', // 获取警报总数
  getClaimAlertCount: 'get_alert_count_by_claim_status', // 全部已认领的alert数
  getAllProcessingAlertCount: 'get_processing_alert_count', // 全部处理中的alert数
  getPerProcessingAlertCount: 'get_processing_alert_count_by_user', // 个人处理中的alert数
  getClosedAlertCount: 'get_closed_alert_count', // 获取个人已关闭alert数
};
