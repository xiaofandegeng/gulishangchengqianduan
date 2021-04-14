import request from '@/utils/request'



export default {
    // 获得所有的课程分类列表
    getAllSubject() {
        return request({
          url: '/eduService/eduSubject/getAllSubject',
          method: 'get'
        })
    }
}