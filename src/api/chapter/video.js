import request from '@/utils/request'

export default {
    // 新增小节
    addVideo(video) {
      return request({
        url: '/eduService/video/addVideo',
        method: 'post',
        data: video
      })
    },
    //根据小节id查询小节
    getVideo(id) {
      return request({
        url: '/eduService/video/getVideo/' + id,
        method: 'get'
      })
    },
    //修改小节
    updateVideo(video) {
      return request({
        url: '/eduService/video/updateVideo',
        method: 'post',
        data: video
      })
    },
    //删除小节id
    delVideo(id) {
      return request({
        url: '/eduService/video/' + id,
        method: 'delete'
      })
    },

}