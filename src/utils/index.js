import Vue from 'vue'
import ActivityStat from './ActivityStat'

// 活动埋点api
let option = {}
// 来源媒介：1-线上 2-线下
option.utm_medium = '1'
// 来源渠道：如：高财生APP，官方网站，百度推广，www.xxx.com...
option.utm_source = '网站'
// 来源的内容：如banner/卡片名称/广告ID...
option.utm_content = '广告1'
// 来源的活动id
option.utm_campaign = '1'
ActivityStat.init(option)
Vue.prototype.ActivityStat = ActivityStat
