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
            v-model="filters.name"
            size="small"
            placeholder="课程名称"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="handleAdd"
            v-if="utype == '管理员'"
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
        prop="name"
        align="center"
        label="课程名称"
        min-width="20%"
      ></el-table-column>
      <el-table-column prop="title" align="center" label="老师" min-width="20%">
        <template #default="scope">
          {{ scope.row.userinfoVO.name }}
          {{ scope.row.userinfoVO.sno }}</template
        >
      </el-table-column>

      <el-table-column label="操作" align="center" width="300">
        <template #default="scope">
          <el-button
            v-if="utype == '管理员'"
            type="primary"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="utype == '管理员'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >


         <el-button
            v-if="utype == '学生'"
            type="success"
            size="mini"
            @click="handlePj(scope.$index, scope.row)"
            >开始评教</el-button
          >


 <el-button
            v-if="utype == '管理员' || utype == '老师'"
            type="success"
            size="mini"
            @click="handleResult(scope.$index, scope.row)"
            >评教结果</el-button
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
      title="课程信息"
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
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="formData.name" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="老师" prop="tid">
          <el-select
            v-model="formData.tid"
            placeholder="请选择"
            style="width: 50%"
          >
            <el-option label="请选择" value=""> </el-option>
            <el-option
              v-for="item in userinfoList"
              :key="item.id"
              :label="item.name + ' ' + item.sno"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
  name: "Kcinfo",
  components: {},
  data() {
    return {
      filters: {
        //列表查询参数
        name: "",
        tid: "",
      },
      page: {
        currentPage: 1, // 当前页
        pageSize: 8, // 每页显示条目个数
        totalCount: 0, // 总条目数
      },
      userinfoList: "",
      listLoading: false, //列表加载状态
      btnLoading: false, //保存按钮加载状态
      datalist: [], //表格数据
      formVisible: false, //表单是否可见，默认不可见
      formData: {}, //表单数据
      ureadonly: false,
      utype: "",
      rules: {},
      addrules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        tid: [{ required: true, message: "请输入老师", trigger: "blur" }],
      },
      modifyrules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        tid: [{ required: true, message: "请输入老师", trigger: "blur" }],
      },
    };
  },
  created() {
    let utype = sessionStorage.getItem("utype");
    this.utype = utype;
    this.getDatas();
    this.getUserinfoList();
  },
  methods: {
    handleAdd() {
      //弹出新增窗口
      this.formVisible = true;
      this.ureadonly = false;
      this.rules = this.addrules;
      this.formData = {};
    },
    handleEdit(index, row) {
      //打开修改界面
      this.formVisible = true;
      this.ureadonly = true;
      this.rules = this.modifyrules;
      this.formData = JSON.parse(JSON.stringify(row));
    },

  handleResult(index, row) {
        
      this.formData = JSON.parse(JSON.stringify(row));
      window.location.href = '/timuResult?dtid=' + this.formData.id;
    },
    
    handlePj(index, row) {
      this.formData = JSON.parse(JSON.stringify(row));
      let sj = this.formData.seconds;

      var user = sessionStorage.getItem("currentUser");
      user = JSON.parse(user);

      let para = {};

      let url =
        base + "/xsksitem/checkks?uid=" + user.id + "&ksid=" + this.formData.id;

      request.post(url, para).then((res) => {
        let code = res.code;
        if (code == 200) {
          this.$router.push("/datiAll?ksid=" + this.formData.id);
        } else {
          let msg = res.msg;
          this.$message({
            message: msg,
            type: "error",
            offset: 320,
          });
        }
      });
    },

    save() {
      if (this.formData.id != null) {
        //如果有ID就修改数据
        this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            let url = base + "/kcinfo/update?id=" + this.formData.id;
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
                window.location.href = "kcinfo";
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
            let url = base + "/kcinfo/add";
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
                window.location.href = "kcinfo";
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
          let url = base + "/kcinfo/del?id=" + row.id;
          request.post(url).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
              offset: 320,
            });
            window.location.href = "kcinfo";
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
        name: this.filters.name,
        tid: this.filters.tid,
      };

      if (this.utype == "老师") {
        var user = sessionStorage.getItem("currentUser");
        user = JSON.parse(user);
        para = {
          name: this.filters.name,
          tid: user.id,
        };
      }

      if (this.utype == "学生") {
        var user = sessionStorage.getItem("currentUser");
        user = JSON.parse(user);
        para = {
          name: this.filters.name,
          bid: user.bid,
        };
      }


      this.listLoading = true;
      let url = base + "/kcinfo/list?currentPage=" + this.page.currentPage;
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
      let url = base + "/kcinfo/listUserinfoAll";
      request.post(url, para).then((res) => {
        this.userinfoList = res.resdata;
      });
    },
  },
};
</script>
