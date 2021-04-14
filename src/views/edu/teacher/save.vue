<template>
    <div class="app-container">
        <el-form label-width="120px">
        <el-form-item label="讲师名称">
            <el-input v-model="teacher.name"/>
        </el-form-item>
        <el-form-item label="讲师排序">
            <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="讲师头衔">
            <el-select v-model="teacher.level" clearable placeholder="请选择">
            <!--
                数据类型一定要和取出的json中的一致，否则没法回填
                因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
            </el-select>
        </el-form-item>
        <el-form-item label="讲师资历">
            <el-input v-model="teacher.career"/>
        </el-form-item>
        <el-form-item label="讲师简介">
            <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
        </el-form-item>

        <!-- 讲师头像：TODO -->
        <!-- 讲师头像 -->
        <el-form-item label="讲师头像">

            <!-- 头衔缩略图 -->
            <pan-thumb :image="teacher.avatar"/>
            <!-- 文件上传按钮 -->
            <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

            <!--
                v-show：是否显示上传组件
                :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                :url：后台上传的url地址
                @close：关闭上传组件
                @crop-upload-success：上传成功后的回调 -->
            <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduoss/fileoss/uploadFile'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>
        </el-form-item>


        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
import teacherApi from '@/api/teacher/teacher.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
    components: {ImageCropper, PanThumb},

    data() {
        return{
            teacher: {
                name: '',
                sort: 0,
                level: 1,
                career: '',
                intro: '',
                avatar: ''

            },

            imagecropperShow: false,
            imagecropperKey: 0,
            BASE_API: process.env.BASE_API,
            saveBtnDisabled: false
        }
    },
    created() {
        if(this.$route.params && this.$route.params.id){
            const id = this.$route.params.id
            this.getById(id)
        }

    },

    //vue监听
    watch: {
        $route(to, from) {
            this.init()
        }
    },


    methods: {
        saveOrUpdate() {
            if(this.teacher.id != null) {
                this.updateById()
            } else{
                this.save()
            }
            this.saveBtnDisabled = true
        },

        //保存教师
        save() {
            teacherApi.addTeacher(this.teacher)
                .then(res => {
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '添加讲师成功!'
                    })        
                    //路由跳转
                    this.$router.push({path: "/teacher/table"})            
                })
        },
        //获取讲师信息
        getById(id) {
            teacherApi.getById(id).then(response => {
                this.teacher = response.data.item
            }).catch((response) => {
                this.$message({
                    type: 'error',
                    message: '获取数据失败'
                })
            })
        },
        //修改讲师
        updateById() {
            teacherApi.updateById(this.teacher).then( () => {
                this.$message({
                    type: 'success',
                    message: '修改讲师成功!'
                })        
                //路由跳转
                this.$router.push({path: "/teacher/table"})  
            }).console( err => {
                this.$message({
                    type: 'error',
                    message: '修改失败'
                })
            })
        },
        init() {
            if(this.$route.params && this.$route.params.id){
                const id = this.$route.params.id
                this.getById(id)
            }else{
                this.teacher = {}
            }

        },

        //上传头像
        cropSuccess(data) {
            this.imagecropperShow = false
            this.teacher.avatar = data.url
            // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1
        },
        close() {
            this.imagecropperShow = false
            // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1
        }

    }
}
</script>