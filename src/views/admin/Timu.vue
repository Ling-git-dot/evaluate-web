<template>
  <section style="margin: 10px;width:100%">
    <!--工具条-->
    <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0px; margin-left: 10px"
    >
      <el-form :inline="true" :model="filters">
        
 
        <el-form-item>
          <el-button type="primary" size="small" @click="handleAdd"
            >新增</el-button
          >
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
       
      <el-table-column
        prop="title"
        align="center"
        label="题干"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="xxa"
        align="center"
        label="选项A"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="xxb"
        align="center"
        label="选项B"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="xxc"
        align="center"
        label="选项C"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="xxd"
        align="center"
        label="选项D"
        min-width="20%"
      ></el-table-column>
     
      <el-table-column label="操作" align="center" width="300">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
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
    <!--表单-->
    <el-dialog
      title="题目信息"
      v-model="formVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="formData"
        ref="formDataRef"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="题目类型" prop="ctype" v-if="modify">
          <el-select  @change="selectType"
            v-model="formData.ctype"
            placeholder="请选择"
            style="width: 50%"
          >
            <el-option label="请选择" value=""> </el-option>
            <el-option label="单选" value="1"> </el-option>
            <el-option label="问答" value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题干" prop="title">
          <el-input v-model="formData.title" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="选项A" prop="xxa" v-if="kgt">
          <el-input v-model="formData.xxa" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="选项B" prop="xxb" v-if="kgt">
          <el-input v-model="formData.xxb" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="选项C" prop="xxc" v-if="kgt">
          <el-input v-model="formData.xxc" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="选项D" prop="xxd" v-if="kgt">
          <el-input v-model="formData.xxd" style="width: 50%"></el-input>
        </el-form-item>
   
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="save"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </section>
</template>
<script>
import request, { base } from "../../../utils/http";
export default {
  name: "Timu",
  components: {},
  data() {
    return {
      filters: {
        //列表查询参数
        ctype: "",
        dtid: "",
      },
      page: {
        currentPage: 1, // 当前页
        pageSize: 8, // 每页显示条目个数
        totalCount: 0, // 总条目数
      },
      ksinfoList: "",
      listLoading: false, //列表加载状态
      btnLoading: false, //保存按钮加载状态
      datalist: [], //表格数据
      dtid:'',
      kgt:true,
      formVisible: false, //表单是否可见，默认不可见
      formData: {}, //表单数据
      ureadonly: false,
      modify:true,
      rules: {},
        addzgrules: {
        ctype: [{ required: true, message: "请选择题目类型", trigger: "blur" }],
        title: [{ required: true, message: "请输入题干", trigger: "blur" }],
       
      },

      addkgrules: {
        ctype: [{ required: true, message: "请选择题目类型", trigger: "blur" }],
        title: [{ required: true, message: "请输入题干", trigger: "blur" }],
        xxa: [{ required: true, message: "请输入选项A", trigger: "blur" }],
        xxb: [{ required: true, message: "请输入选项B", trigger: "blur" }],
        xxc: [{ required: true, message: "请输入选项C", trigger: "blur" }],
        xxd: [{ required: true, message: "请输入选项D", trigger: "blur" }],
       
      },

       modifyzgrules: {
        ctype: [{ required: true, message: "请选择题目类型", trigger: "blur" }],
        title: [{ required: true, message: "请输入题干", trigger: "blur" }],
 
      },

      modifykgrules: {
       ctype: [{ required: true, message: "请选择题目类型", trigger: "blur" }],
        title: [{ required: true, message: "请输入题干", trigger: "blur" }],
        xxa: [{ required: true, message: "请输入选项A", trigger: "blur" }],
        xxb: [{ required: true, message: "请输入选项B", trigger: "blur" }],
        xxc: [{ required: true, message: "请输入选项C", trigger: "blur" }],
        xxd: [{ required: true, message: "请输入选项D", trigger: "blur" }],
       
      },
    };
  },
  created() {
        this.dtid = 0;
    this.getDatas();
   
  },
  methods: {
        handleReback() {
      this.$router.push("/ksinfo");
    },
    handleAdd() {
      //弹出新增窗口
      this.formVisible = true;
      this.ureadonly = false;
      this.rules = this.addkgrules;
      this.formData = {};
    },
    handleEdit(index, row) {
      //打开修改界面
      this.formVisible = true;
      this.ureadonly = true;
       this.modify = false;
 
      this.formData = JSON.parse(JSON.stringify(row));
      if(this.formData.ctype==1){
         this.rules = this.modifykgrules;
         this.kgt = true;
      }else{
        this.rules = this.modifyzgrules;
         this.kgt = false;
      }
    },
    save() {
      if (this.formData.id != null) {
        //如果有ID就修改数据
        this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            let url = base + "/timu/update?id=" + this.formData.id;
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
                 window.location.href = "/timu?dtid=" + this.dtid;
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
            let url = base + "/timu/add";
            //var user = sessionStorage.getItem("currentUser");
            //user = JSON.parse(user);
            this.formData.dtid = 0;
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
                window.location.href = "/timu?dtid=" + this.dtid;
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
          let url = base + "/timu/del?id=" + row.id;
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
    selectType(){
       console.log(this.formData.ctype  + "  =======")
       if(this.formData.ctype=='1'){
          this.kgt = true;

          if(this.formData.id==null){
              this.rules = this.addkgrules;
         
          }else{
             this.rules = this.modifykgrules;
          }


       }else{
        this.kgt = false;

         if(this.formData.id==null){
              this.rules = this.addzgrules;
         
          }else{
             this.rules = this.modifyzgrules;
          }



       }
       
   


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
        ctype: this.filters.ctype,
        
      };
      this.listLoading = true;
      let url = base + "/timu/list?currentPage=" + this.page.currentPage;
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
     
  },
};
</script>
