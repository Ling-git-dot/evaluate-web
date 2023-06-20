<template>
    <section style="margin: 10px;width:100%">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-left: 10px">
          <el-form :inline="true"  :model="filters" >
           
  
              <el-form-item>
                  <el-button type="primary" size="small"  @click="handleReback">返回</el-button>
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
              size ="small"
              style="width: 100%;"
      >
          <el-table-column prop="da" align="center" label="答案" min-width="20%"></el-table-column>
 
          
      </el-table>

       



  </section>
</template>
<script>
import * as echarts from "echarts";
import request, { base } from "../../../utils/http";

export default {
  name: "Echarts",
  data() {
    return {
      dtid: 0,
      tmid: 0,
      listLoading:false,
      datalist: [], //表格数据
    };
  },
  created() {
    this.tmid = this.$route.query.tmid;
    this.dtid = this.$route.query.dtid;
  },
  methods: {
    handleReback() {
      this.$router.push("/timuResult?dtid=" + this.dtid);
    },
    getDatas() {
      let para = {};
      let url = base + "/xsksitem/report?tmid=" + this.tmid + "&dtid=" + this.dtid;
      request.post(url, para).then((res) => {
        this.datalist = res.resdata.datas;
      });
    },
  },
  mounted() {
    this.getDatas();
  },
};
</script>

<style>
.main {
  text-align: center;
  background-color: #fff;
  border-radius: 20px;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>