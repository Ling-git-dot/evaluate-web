<template>
    <section style="margin: 10px">
        <!--工具条-->
        <el-col
                :span="24"
                class="toolbar"
                style="padding-bottom: 0px; margin-left: 10px"
        >
            <el-form :inline="true" :model="filters">
                                                            <label>问卷信息：</label>
                                                                            <el-form-item label="问卷信息" prop="xsksid" >
                                <el-select
                                        v-model="filters.xsksid"
                                        placeholder="请选择"
                                        style="width: 50%"
                                >
                                    <el-option label="请选择" value="0"> </el-option>
                                    <el-option
                                            v-for="item in xsksinfoList"
                                            :key="item.id"
                                            :label="item.sid"
                                            :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                                                                                <label>题目：</label>
                                                                            <el-form-item label="题目" prop="tmid" >
                                <el-select
                                        v-model="filters.tmid"
                                        placeholder="请选择"
                                        style="width: 50%"
                                >
                                    <el-option label="请选择" value="0"> </el-option>
                                    <el-option
                                            v-for="item in timuList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
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
                     prop="xsksid"
                     align="center"
                     label="问卷信息"
                     min-width="20%"
             ></el-table-column>
                      <el-table-column
                     prop="tmid"
                     align="center"
                     label="题目"
                     min-width="20%"
             ></el-table-column>
                      <el-table-column
                     prop="da"
                     align="center"
                     label="答案"
                     min-width="20%"
             ></el-table-column>
                      <el-table-column
                     prop="fs"
                     align="center"
                     label="分数"
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
                title="问卷明细"
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
                        <el-form-item label="问卷信息" prop="xsksid" >
                            <el-select
                                    v-model="formData.xsksid"
                                    placeholder="请选择"
                                    style="width: 50%"
                            >
                                <el-option label="请选择" value="0"> </el-option>
                                <el-option
                                        v-for="item in xsksinfoList"
                                        :key="item.id"
                                        :label="item.sid"
                                        :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="题目" prop="tmid" >
                            <el-select
                                    v-model="formData.tmid"
                                    placeholder="请选择"
                                    style="width: 50%"
                            >
                                <el-option label="请选择" value="0"> </el-option>
                                <el-option
                                        v-for="item in timuList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                                                <el-form-item label="答案" prop="da">
                        <el-input
                                v-model="formData.da"
                                type="textarea"
                                rows="10"
                                style="width: 80%"
                        ></el-input>
                    </el-form-item>
                                                    <el-form-item label="分数" prop="fs">
                          <el-input v-model="formData.fs"   style="width: 50%"  ></el-input>
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
        name: "Xsksitem",
        components: {
                    },
        data() {
            return {
                filters: {
                    //列表查询参数
                                                xsksid:"",
                                                                tmid:"",
                },
                page: {
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页显示条目个数
                    totalCount: 0, // 总条目数
                },
                                    xsksinfoList: "",
                                    timuList: "",
                                listLoading: false, //列表加载状态
                btnLoading: false, //保存按钮加载状态
                datalist: [], //表格数据
                formVisible: false, //表单是否可见，默认不可见
                formData: {}, //表单数据
                ureadonly: false,
                rules: {},
                addrules: {
                            fs: [
                                                                    { required: true, message: "请输入分数", trigger: "blur" },
                                                    ],
                },
                modifyrules: {
                    fs: [
                                                    { required: true, message: "请输入分数", trigger: "blur" },
                                    ],
                                            },
            };
        },
        created() {
            this.getDatas();
              this.getXsksinfoList();
              this.getTimuList();
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
                    let url = base + "/xsksitem/update?id=" + this.formData.id;
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
                    let url = base + "/xsksitem/add";
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
                let url = base + "/xsksitem/del?id=" + row.id;
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
                        xsksid: this.filters.xsksid,
                        tmid: this.filters.tmid,
                };
                this.listLoading = true;
                let url = base + "/xsksitem/list?currentPage=" + this.page.currentPage;
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
                getXsksinfoList() {
                    let para = {};
                    this.listLoading = true;
                    let url = base + "/xsksitem/listXsksinfoAll";
                    request.post(url, para).then((res) => {
                        this.xsksinfoList = res.resdata;
                });
                },
                getTimuList() {
                    let para = {};
                    this.listLoading = true;
                    let url = base + "/xsksitem/listTimuAll";
                    request.post(url, para).then((res) => {
                        this.timuList = res.resdata;
                });
                },
                    },
    };
</script>
