<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
//引入subject后端接口
import teacher from "@/api/subject/subject.js"

export default {

  data() {
    return {
      filterText: '',
      data2: [], //课程列表数据
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
      this.getAllSubject()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    //获得课程分类列表
    getAllSubject() {
        teacher.getAllSubject().then(res => {
            console.log(res.data)
            this.data2 = res.data.list
        });
    },



    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>

