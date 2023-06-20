<template>
  <section style="margin: 10px; width: 100%">
    <!--工具条-->
    <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0px; margin-left: 10px"
    >
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button
            type="default"
            size="small"
            @click="handleReback"
            style="margin-left: 10px"
            >返回</el-button
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
      <el-form-item label="题干" prop="title">
        <el-input v-model="formData.title" style="width: 50%"></el-input>
      </el-form-item>
      <el-table-column prop="name" label="选项A" min-width="20%">
        <template #default="scope">
          <span style="font-size: 16px; color: red" v-if="scope.row.ctype == 1"
            >{{ scope.row.anums }}票</span
          >
          {{ scope.row.xxa }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="选项B" min-width="20%">
        <template #default="scope">
          <span style="font-size: 16px; color: red" v-if="scope.row.ctype == 1"
            >{{ scope.row.bnums }}票</span
          >
          {{ scope.row.xxb }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="选项C" min-width="20%">
        <template #default="scope">
          <span style="font-size: 16px; color: red" v-if="scope.row.ctype == 1"
            >{{ scope.row.cnums }}票</span
          >
          {{ scope.row.xxc }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="选项D" min-width="20%">
        <template #default="scope">
          <span style="font-size: 16px; color: red" v-if="scope.row.ctype == 1"
            >{{ scope.row.dnums }}票</span
          >
          {{ scope.row.xxd }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >统计结果</el-button
          >
        </template>
      </el-table-column>
    </el-table>

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
          <el-select
            @change="selectType"
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
      dtid: "",
      kgt: true,
      formVisible: false, //表单是否可见，默认不可见
      formData: {}, //表单数据
      ureadonly: false,
      modify: true,
      rules: {},
      utype:'',
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
    let utype = sessionStorage.getItem("utype");
    this.utype = utype;

    this.dtid = this.$route.query.dtid;
    this.getDatas();
    this.getKsinfoList();
  },
  methods: {
    handleReback() {
       this.$router.push("/kcinfo");
     
    },
    handleAdd() {
      //弹出新增窗口
      this.formVisible = true;
      this.ureadonly = false;
      this.rules = this.addkgrules;
      this.formData = {};
    },
    handleEdit(index, row) {
      this.formData = JSON.parse(JSON.stringify(row));
      if (this.formData.ctype == 1) {
        window.location.href = "report?tmid=" + row.id + "&dtid=" + this.dtid;
      }
      if (this.formData.ctype == 2) {
        window.location.href = "report1?tmid=" + row.id + "&dtid=" + this.dtid;
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
            this.formData.dtid = this.dtid;
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
    selectType() {
      console.log(this.formData.ctype + "  =======");
      if (this.formData.ctype == "1") {
        this.kgt = true;

        if (this.formData.id == null) {
          this.rules = this.addkgrules;
        } else {
          this.rules = this.modifykgrules;
        }
      } else {
        this.kgt = false;

        if (this.formData.id == null) {
          this.rules = this.addzgrules;
        } else {
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
        dtid: this.dtid,
      };
      this.listLoading = true;
      let url = base + "/timu/list1";
      console.log(url);
      request.post(url, para).then((res) => {
        this.datalist = res.resdata;
        this.listLoading = false;
      });
    },
    getKsinfoList() {
      let para = {};
      this.listLoading = true;
      let url = base + "/timu/listKsinfoAll";
      request.post(url, para).then((res) => {
        this.ksinfoList = res.resdata;
      });
    },
  },
};
</script>
