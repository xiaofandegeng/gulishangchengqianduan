<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <el-form label-width="120px">

        <el-form-item label="课程标题">
            <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课"/>
        </el-form-item>

        <!-- 所属分类 TODO -->
        <!-- 课程分类 -->
        <el-form-item label="课程分类">
            <!-- 一级分类 -->
            <el-select
                v-model="courseInfo.subjectParentId"
                placeholder="请选择" @change="subjectLevelOneChanged">
                <el-option
                v-for="subject in oneSubjectList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>
            <!-- 二级分类 -->
            <el-select
                v-model="courseInfo.subjectId"
                placeholder="请选择">
                <el-option
                v-for="subject in twoSubjectList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>            
        </el-form-item>

        <!-- 课程讲师 TODO -->
        <!-- 课程讲师 -->
        <el-form-item label="课程讲师">
            <el-select
                v-model="courseInfo.teacherId"
                placeholder="请选择">
                <el-option
                v-for="teacher in teacherList"
                :key="teacher.id"
                :label="teacher.name"
                :value="teacher.id"/>
            </el-select>
        </el-form-item>

        <el-form-item label="总课时">
            <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程简介 TODO -->
        <!-- 课程简介-->
        <el-form-item label="课程简介">
            <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>

        <!-- 课程封面 TODO -->
        <!-- 课程封面-->
        <el-form-item label="课程封面">

        <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduoss/fileoss/uploadFile'"
            class="avatar-uploader">
            <img :src="courseInfo.cover">
        </el-upload>

        </el-form-item>

        <el-form-item label="课程价格">
            <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="updateOrSave">保存并下一步</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/course/course'
import subject from '@/api/subject/subject'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  title: '',
  subjectId: '',//二级分类
  subjectParentId: '', //一级分类
  teacherId: '', 
  lessonNum: 0,
  description: '',
  cover: '/static/01.jpg',
  price: 0
}

export default {
    components: { Tinymce },

    data() {
        return {
            saveBtnDisabled: false,
            courseInfo: defaultForm,
            teacherList: [],
            oneSubjectList: [],
            twoSubjectList: [],
            BASE_API: process.env.BASE_API,
            courseId: '' //课程id
        }
    },
    created() {
        // 获取到当前课程id查询到相关信息
        if(this.$route.params && this.$route.params.id) {
            this.courseId = this.$route.params.id,
            this.getCourseInfo()
        }else{
            //页面加载时获取到所有的讲师信息
            this.getTeacherList()
            this.getAllSubject()
        }
    },
    methods: {
        //根据课程id获取课程信息
        getCourseInfo() {
            course.getCourseInfo(this.courseId).then(res => {
                this.courseInfo = res.data.courseInfo
                //先查询所有的分类
                subject.getAllSubject().then(res => {
                    this.oneSubjectList = res.data.list
                    for(let i = 0; i < this.oneSubjectList.length; i++) {
                        var oneSubject = this.oneSubjectList[i]
                        if(this.courseInfo.subjectParentId == oneSubject.id){
                            this.twoSubjectList = oneSubject.children
                        }
                    }
                })
                //初始化所有的讲师
                this.getTeacherList()

            })
        },

        //上传封面成功
        handleAvatarSuccess(res, file) {
            this.courseInfo.cover = res.data.url
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        //添加课程基本信息
        addCourse() {
            //添加课程基本信息
            course.addCourseInfo(this.courseInfo).then( res => {
                this.$message({
                    type: 'success',
                    message: '添加课程基本信息成功'
                })
                this.$router.push({path: "/course/chapter/" + res.data.courseId})
            })  
        },
        //修改课程基本信息
        updateCourse() {
            //添加课程基本信息
            course.updateCourseInfo(this.courseInfo).then( res => {
                this.$message({
                    type: 'success',
                    message: '修改课程基本信息成功'
                })
                this.$router.push({path: "/course/chapter/" + this.courseId})
            })  
        },

        updateOrSave() {
            if(this.$route.params && this.$route.params.id) {
                this.updateCourse()
            } else{
                this.addCourse()
            }

        },
        //查询所有的讲师
        getTeacherList() {
            course.getTeacherList().then(res => {
                this.teacherList = res.data.items
            })
        },
        // 获得所有的课程分类 一级分类
        getAllSubject() {
            subject.getAllSubject().then(res => {
                console.log(res.data.list)
                this.oneSubjectList = res.data.list
            })
        },
        subjectLevelOneChanged(val){
            for(let i = 0; i < this.oneSubjectList.length; i++ ){
                if(this.oneSubjectList[i].id === val) {
                    this.twoSubjectList = this.oneSubjectList[i].children
                }
            }
            this.courseInfo.subjectId = ''
        }
        
    }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>