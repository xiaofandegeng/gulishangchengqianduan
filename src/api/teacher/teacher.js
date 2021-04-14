import request from '@/utils/request'

// export function pageListTeacher(current, limit) {
//   return request({
//     url: '/eduservice/teacher/pageTeacher/{current}/{limit}',
//     method: 'get',
//     data: {
//         current,
//         limit
//     }
//   })
// }

export default {
    // 按照条件查询讲师
    pageTeacherCondition(current, limit, teacherQuery) {
        return request({
          url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
          method: 'post',
          data: teacherQuery

        })
    },

    // 根据id删除讲师
    deleteById(id) {
        return request({
          url: `/eduservice/teacher/${id}`,
          method: 'delete',
        })
    },

    // 新增讲师
    addTeacher(teacher) {
        return request({
          url: `/eduservice/teacher/addTeacher`,
          method: 'post',
          data: teacher
        })
    },

    //获取讲师
    getById(id) {
        return request({
            url: `/eduservice/teacher/getTeahcer/${id}`,
            method: 'get'
        })
    },

    //修改讲师
    updateById(teacher) {
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'put',
            data: teacher
        })
    }
}