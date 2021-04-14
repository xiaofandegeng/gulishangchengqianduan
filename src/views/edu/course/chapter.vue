<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in allChapterVideoList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}

                <span class="acts">
                    <el-button type="text" @click="openVideoDialog(chapter.id)">添加课时</el-button>
                    <el-button style="" type="text" @click="openEditDialog(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                </span>
            </p>

            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text">编辑</el-button>
                            <el-button type="text">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 课时弹框 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import chapter from '@/api/chapter/chapter'
import video from '@/api/chapter/video'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      allChapterVideoList: [], //所有章节小节的信息
      courseId: '', //课程id
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的章节id
      video: {// 课时对象
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: ''
      },
      dialogChapterFormVisible: false, //是否显示章节表单
      chapter:{ //章节对象
        title: '',
        sort: 0
      }
    }
  },

  created() {
    if(this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getAllChapterVideo()
    }
    
  },

  methods: {
    // 添加课时
    addVideo(){
      video.addVideo(this.video).then(res => {
        alert(this.video)
        //关闭弹窗
        this.dialogVideoFormVisible = false
        //提示消息
        this.$message({
            type: 'success',
            message: '添加课时信息成功'
        })
        //刷新页面
        this.getAllChapterVideo()
        })
    },

    saveOrUpdateVideo() {
      this.addVideo()
    },
    //打开课时弹框
    openVideoDialog(chapterId){
      this.dialogVideoFormVisible = true
      this.video.chapterId = chapterId
      this.video.courseId = this.courseId
    },




////////////////////////////////////////////////////////////

    //删除章节
    removeChapter(id){
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          chapter.delChapter(id)
              .then( response => {
                  this.$message({
                      type: 'success',
                      message: '删除章节成功!'
                  })
          //刷新页面
          this.getAllChapterVideo()
        })
      })   
    },

    //打开修改章节表单
    openEditDialog(id) {
      this.dialogChapterFormVisible = true
      //根据id查询到章节信息
      chapter.getChapter(id).then(res => {
        this.chapter = res.data.chapter
      })
    },

    //添加表单按钮
    openChapterDialog() {
      this.dialogChapterFormVisible = true
      //清空表单
      this.chapter.title = '',
      this.chapter.sort = 0,
      this.chapter.id = ''
    },

    //修改章节
    updateChapter(){
      chapter.updateChapter(this.chapter).then(res => {
        //关闭弹窗
        this.dialogChapterFormVisible = false
        //提示消息
        this.$message({
            type: 'success',
            message: '修改章节信息成功'
        })
        //刷新页面
        this.getAllChapterVideo()
        
      })
    },

    //新增章节
    addChapter() {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter).then(res => {
        //关闭弹窗
        this.dialogChapterFormVisible = false
        //提示消息
        this.$message({
            type: 'success',
            message: '添加章节信息成功'
        })
        //刷新页面
        this.getAllChapterVideo()
        
      })
    },
    saveOrUpdateChapter(){
      if(!this.chapter.id) {
        this.addChapter()
      }else{
        this.updateChapter()
      }
    },
    // 根据课程id获得所有的章节和小节
    getAllChapterVideo(){
      chapter.getAllChapterVideo(this.courseId).then( res =>{
        // 如何存在课程id去查询所有的信息
          this.allChapterVideoList = res.data.list
      })
    }
    ,
    previous() {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },

    next() {
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }
}
</script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  /* float: left; */
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>