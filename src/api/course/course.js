import request from '@/utils/request'



export default {
    // 获得所有的课程分类列表
    addCourseInfo(courseInfo) {
        return request({
          url: '/eduService/course/addCourseInfo',
          method: 'post',
          data: courseInfo
        })
    },
    // 查询所有讲师
    getTeacherList() {
      return request({
        url: '/eduservice/teacher/findAll',
        method: 'get'
      })
   },
    // 获取课程信息
    getCourseInfo(courseId) {
      return request({
        url: '/eduService/course/getCourseInfo/' + courseId,
        method: 'get'
      })
    },
    // 更新课程信息
    updateCourseInfo(courseInfo) {
      return request({
        url: '/eduService/course/updateCourseInfo',
        method: 'post',
        data: courseInfo
      })
    }

}