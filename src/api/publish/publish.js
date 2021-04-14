import request from '@/utils/request'

export default {
    //根据课程id获取到课程相关信息
    getCourseById(id) {
        return request({
          url: '/eduService/course/getCourseById/' + id,
          method: 'get'
        })
    },
    //最终发布课程
    publishCourse(id) {
      return request({
        url: '/eduService/course/publishCourse/' + id,
        method: 'post'
      })
    }

}