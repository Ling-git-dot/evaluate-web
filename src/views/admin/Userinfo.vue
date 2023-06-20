<template>
  <section style="margin: 10px">
    <!--工具条-->
    <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0px; margin-left: 10px"
    >
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input
            v-model="filters.sno"
            size="small"
            placeholder="工号"
          ></el-input>
        </el-form-item>
       
        <el-form-item>
          <el-input
            v-model="filters.name"
            size="small"
            placeholder="姓名"
          ></el-input>
        </el-form-item>
         
        <el-form-item>
          <el-button type="primary" size="small" @click="query">查询</el-button>
        </el-form-item>
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
        prop="sno"
        align="center"
        label="工号"
        min-width="20%"
      ></el-table-column>
     
      <el-table-column
        prop="name"
        align="center"
        label="姓名"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="sex"
        align="center"
        label="性别"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="age"
        align="center"
        label="年龄"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="tel"
        align="center"
        label="电话"
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
      title="教师信息"
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
        <el-form-item label="工号" prop="sno">
          <el-input v-model="formData.sno" :readonly="ureadonly" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="upwd">
          <el-input v-model="formData.upwd" type="password" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="formData.sex"
            placeholder="请选择"
            style="width: 50%"
          >
       
            <el-option label="男" value="男"> </el-option>
            <el-option label="女" value="女"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="formData.age" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="formData.tel" style="width: 50%"></el-input>
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
  name: "Userinfo",
  components: {},
  data() {
    var snoExist = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入工号"));
      } else {
        let url = base + "/userinfo/snoExist?sno=" + value + "&utype=1";
        request.post(url, this.formData).then((res) => {
          if (res.code == 200) {
            callback();
          } else {
            callback(new Error("工号已存在"));
          }
        });
      }
    };
    return {
      filters: {
        //列表查询参数
        sno: "",
        name: "",
          bid: "",
        utype: "1",
      },
      page: {
        currentPage: 1, // 当前页
        pageSize: 8, // 每页显示条目个数
        totalCount: 0, // 总条目数
      },
      bjinfoList: "",
      listLoading: false, //列表加载状态
      btnLoading: false, //保存按钮加载状态
      datalist: [], //表格数据
      formVisible: false, //表单是否可见，默认不可见
      formData: {}, //表单数据
      ureadonly: false,
      rules: {},
      addrules: {
        sno: [
          { required: true, message: "请输入工号", trigger: "blur" },
          // { validator: snoExist, trigger: "blur" },
        ],
        upwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        tel: [{ required: true, message: "请输入电话", trigger: "blur" }],
         
      },
      modifyrules: {
        sno: [{ required: true, message: "请输入工号", trigger: "blur" }],
        upwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        tel: [{ required: true, message: "请输入电话", trigger: "blur" }],
          
      },
    };
  },
  created() {
    this.getDatas();
     this.getBjinfoList();
  },
  methods: {
    handleAdd() {
      //弹出新增窗口
      this.formVisible = true;
      this.ureadonly = false;
      this.rules = this.addrules;
      this.formData={};
      this.formData.sex = '男';
     
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
            let url = base + "/userinfo/update?id=" + this.formData.id;
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
                window.location.href = 'userinfo';
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
            let url = base + "/userinfo/add";
            //var user = sessionStorage.getItem("currentUser");
            //user = JSON.parse(user);
            this.btnLoading = true;
            this.formData.utype=1;
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
             window.location.href = 'userinfo';
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
          let url = base + "/userinfo/del?id=" + row.id;
          request.post(url).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
              offset: 320,
            });
           window.location.href = 'userinfo';
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
        sno: this.filters.sno,
        name: this.filters.name,
        bid:this.filters.bid,
        utype: 1,
      };
      this.listLoading = true;
      let url = base + "/userinfo/list?currentPage=" + this.page.currentPage;
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
     getBjinfoList() {
      let para = {};
      this.listLoading = true;
      let url = base + "/userinfo/listBjinfoAll";
      request.post(url, para).then((res) => {
        this.bjinfoList = res.resdata;
      });
    },
   
  },
};
</script>
