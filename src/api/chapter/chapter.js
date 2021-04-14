import request from '@/utils/request'

export default {
    // 根据课程id获得所有的章节和小节
    getAllChapterVideo(courseId) {
        return request({
          url: '/eduService/chapter/getAllChapterVideo/' + courseId,
          method: 'get'
        })
    },
    // 新增章节
    addChapter(chapter) {
      return request({
        url: '/eduService/chapter/addChapter',
        method: 'post',
        data: chapter
      })
    },
    //根据章节id查询章节
    getChapter(chapterId) {
      return request({
        url: '/eduService/chapter/getChapter/' + chapterId,
        method: 'get'
      })
    },
    //修改章节
    updateChapter(chapter) {
      return request({
        url: '/eduService/chapter/updateChapter',
        method: 'post',
        data: chapter
      })
    },
    //删除章节
    delChapter(chapterId) {
      return request({
        url: '/eduService/chapter/' + chapterId,
        method: 'delete'
      })
    },

}