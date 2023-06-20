<template>
 <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0px; margin-left: 10px"
    >
      <el-form :inline="true" :model="filters">
        
 
      
         <el-form-item>
          <el-button type="default" size="small" @click="handleReback" style="margin-left:10px;"
            >返回</el-button
          >
        </el-form-item>


      </el-form>
    </el-col>
<div class="main" style="margin-top:70px;">
   <div class="Echarts">
    <div id="main" style="width: 800px;height:500px;"></div>
  </div>
</div>

</template>

<script>
import * as echarts from 'echarts';
import request, { base } from "../../../utils/http";

export default {
  name: 'Echarts',
  data() {
    return {
       dtid:0,
      tmid:0,
      gylname: [],
        gylrs: []
   
    };
  },
  created(){
     this.tmid = this.$route.query.tmid;
	  this.dtid = this.$route.query.dtid;
  },
  methods:{
         handleReback() {
      this.$router.push("/timuResult?dtid=" + this.dtid);
    },
       getDatas() {
      let para = {};
      let url = base + "/xsksitem/report?tmid=" + this.tmid + "&dtid=" + this.dtid;
      request.post(url, para).then((res) => {
        this.gylname = res.resdata.names;
        this.gylrs = res.resdata.nums;
        
	    this.myEcharts();



      });
    },
	  myEcharts(){
		  // 基于准备好的dom，初始化echarts实例
		  var myChart = echarts.init(document.getElementById('main'));
		  // 指定图表的配置项和数据
		  var option = {
			  title: {
				  text: ''
			  },
			  tooltip: {},
			  legend: {
				  data:['票数']
			  },
			  xAxis: {
				  data: this.gylname
			  },
			 yAxis: {
               minInterval: 1
            },
			  series: [{
				  name: '票数',
                  itemStyle : { normal:
                    {
                         label : {show: true,formatter: '{c}票' 
                         
                         }
                    }
                 },
				  type: 'bar',
				  data:this.gylrs
			  }]
		  };

		  // 使用刚指定的配置项和数据显示图表。
		  myChart.setOption(option);
		  }
  },
  mounted() {
    this.getDatas();
  

  },
    
   
}
</script>

<style>
 .main{
	text-align: center;
	background-color: #fff;
	border-radius: 20px;
 
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
}
 
</style>