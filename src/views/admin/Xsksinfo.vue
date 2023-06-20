<template>
  <section style="margin: 10px">
    <!--工具条-->
    <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0px; margin-left: 10px"
    >
      <el-form :inline="true" :model="filters">
        
        <el-form-item label="问卷" prop="ksid">
          <el-select
            v-model="filters.ksid"
            placeholder="请选择"
            
          >
            <el-option label="请选择" value="0"> </el-option>
            <el-option
              v-for="item in ksinfoList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query">查询</el-button>
        </el-form-item>
       
      </el-form>
    </el-col>
    <!--列表-->
    <el-table
      :data="datalist"
      border
      stripe
      v-loading="listLoading"
      highlight-current-row
      max-height="600"
      size="small"
      style="width: 100%"
    >
          <el-table-column prop="name" align="center" label="员工" min-width="20%">
        <template #default="scope">
          {{ scope.row.userinfoVO.name }}  
          </template>
      </el-table-column>
         <el-table-column prop="name" align="center" label="问卷" min-width="25%">
        <template #default="scope">
          {{ scope.row.ksinfoVO.name }}  
          </template>
      </el-table-column>
     
      <el-table-column
        prop="cdate"
        align="center"
        label="填写时间"
        min-width="10%"
      ></el-table-column>
    
      <el-table-column label="操作" align="center" width="200"   >
        <template #default="scope">
          <el-button  
            type="primary"
           
            size="mini"
            @click="handleResult(scope.$index, scope.row)"
            >查看结果</el-button
          >
          <el-button v-if="utype=='管理员'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      background
      layout="total, prev, pager, next, jumper"
      :total="page.totalCount"
      style="float: right; margin: 10px 20px 0 0"
    >
    </el-pagination>
   
  </section>
</template>
<script>
import request, { base } from "../../../utils/http";
export default {
  name: "Xsksinfo",
  components: {},
  data() {
    return {
      filters: {
        //列表查询参数
        sid: "",
        ksid: "",
      },
      page: {
        currentPage: 1, // 当前页
        pageSize: 8, // 每页显示条目个数
        totalCount: 0, // 总条目数
      },
      userinfoList: "",
      ksinfoList: "",
      utype:'',
      listLoading: false, //列表加载状态
      btnLoading: false, //保存按钮加载状态
      datalist: [], //表格数据
      formVisible: false, //表单是否可见，默认不可见
      formData: {}, //表单数据
      ureadonly: false,
      rules: {},
      addrules: {},
      modifyrules: {},
    };
  },
  created() {
    let utype = sessionStorage.getItem("utype");
    this.utype = utype;
    this.getDatas();
    this.getUserinfoList();
    this.getKsinfoList();
  },
  methods: {
    handleAdd() {
      //弹出新增窗口
      this.formVisible = true;
      this.ureadonly = false;
      this.rules = this.addrules;
      this.$nextTick(() => {
        this.$refs["formDataRef"].resetFields();
      });
    },

    
     handleResult(index, row) {
        
      this.formData = JSON.parse(JSON.stringify(row));
      window.location.href = '/timuResult?dtid=' + this.formData.ksid;
    },
    handleEdit(index, row) {
      //打开修改界面
      this.formVisible = true;
      this.ureadonly = true;
      this.rules = this.modifyrules;
      this.formData = JSON.parse(JSON.stringify(row));
    },
    save() {
      if (this.formData.id != null) {
        //如果有ID就修改数据
        this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            let url = base + "/xsksinfo/update?id=" + this.formData.id;
            this.btnLoading = true;
            request.post(url, this.formData).then((res) => {
              if (res.code == 200) {
                this.btnLoading = false;
                this.formVisible = false;
                this.$message({
                  message: "操作成功",
                  type: "success",
                  offset: 320,
                });
                this.getDatas();
                this.$refs["formDataRef"].resetFields();
                this.formData = {};
              } else {
                this.$message({
                  message: "服务器错误",
                  type: "error",
                  offset: 320,
                });
              }
            });
          }
        });
      } else {
        //如果没有ID就新增数据
        this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            let url = base + "/xsksinfo/add";
            //var user = sessionStorage.getItem("currentUser");
            //user = JSON.parse(user);
            this.btnLoading = true;
            request.post(url, this.formData).then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  offset: 320,
                });
                this.btnLoading = false;
                this.formVisible = false;
                this.getDatas();
                this.$refs["formDataRef"].resetFields();
                this.formData = {};
              } else {
                this.$message({
                  message: "服务器错误",
                  type: "error",
                  offset: 320,
                });
              }
            });
          }
        });
      }
    },
    handleDelete(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          let url = base + "/xsksinfo/del?id=" + row.id;
          request.post(url).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
              offset: 320,
            });
            this.getDatas();
          });
        })
        .catch(() => {});
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getDatas();
    },
    query() {
      //查询
      this.getDatas();
    },
    //获取列表数据
    getDatas() {
      //var user = sessionStorage.getItem("currentUser");
      //user = JSON.parse(user);
      let para = {
        sid: this.filters.sid,
        ksid: this.filters.ksid,
      };

 

      if (this.utype == "员工") {
        var user = sessionStorage.getItem("currentUser");
        user = JSON.parse(user);
        para = {
          sid: user.id,
        
        };
      }


      this.listLoading = true;
      let url = base + "/xsksinfo/list?currentPage=" + this.page.currentPage;
      console.log(url);
      request.post(url, para).then((res) => {
        console.log(res);
        if (res.resdata.length > 0) {
          this.isPage = true;
        } else {
          this.isPage = false;
        }
        this.page.totalCount = res.count;
        this.datalist = res.resdata;
        this.listLoading = false;
      });
    },
    getUserinfoList() {
      let para = {};
      this.listLoading = true;
      let url = base + "/xsksinfo/listUserinfoAll";
      request.post(url, para).then((res) => {
        this.userinfoList = res.resdata;
      });
    },
    getKsinfoList() {
      let para = {};
      this.listLoading = true;
      let url = base + "/xsksinfo/listKsinfoAll";
      request.post(url, para).then((res) => {
        this.ksinfoList = res.resdata;
      });
    },
  },
};
</script>
