<template>
  <div class="hzco-classify" style="margin-left: 50px">
    <div class="container" id="content-container">
      <div class="row co-classify-list">
        <div
          style="
            font-size: 22px;
            font-weight: bold;
            margin-left: 10px;
            color: red;
          "
        >
          
        </div>

        <div class="col-md-12">
          <div class="course list row">
            <div class="section-comment-list grid-data">
              <div class="comment-list grid-row-2">
                <div
                  class="comment-item"
                  v-for="(item, index) in zplist"
                  :key="item.id"
                  style="margin-top: 10px"
                >
                  <div class="item-right">
                    <div class="comment-bd">
                      {{ index + 1 }}.{{ item.title }}
                    </div>

                    <div class="xx" v-if="item.ctype == 1">
                      <span class="comment-time"
                        >A.
                        <el-radio
                          label="A"
                          v-model="radio[index]"
                          @change="getIputValue(index)"
                        >
                          {{ item.xxa }}</el-radio
                        ></span
                      >
                    </div>
                    <div class="xx" v-if="item.ctype == 1">
                      <span class="comment-time"
                        >B.
                        <el-radio
                          label="B"
                          v-model="radio[index]"
                          @change="getIputValue(index)"
                        >
                          {{ item.xxb }}</el-radio
                        ></span
                      >
                    </div>
                    <div class="xx" v-if="item.ctype == 1">
                      <span class="comment-time"
                        >C.
                        <el-radio
                          label="C"
                          v-model="radio[index]"
                          @change="getIputValue(index)"
                        >
                          {{ item.xxc }}</el-radio
                        ></span
                      >
                    </div>
                    <div class="xx" v-if="item.ctype == 1">
                      <span class="comment-time"
                        >D.
                        <el-radio
                          label="D"
                          v-model="radio[index]"
                          @change="getIputValue(index)"
                        >
                          {{ item.xxd }}</el-radio
                        ></span
                      >
                    </div>

                    <div class="xx" v-if="item.ctype == 2">
                      <el-input
                        @change="getIputValue(index)"
                        v-model="radio[index]"
                        rows="6"
                        type="textarea"
                      ></el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="width: 100%; text-align: center; margin: 10px auto">
              <button
                @click="submitDati"
                type="button"
                style="width: 150px"
                class="passport-btn passport-btn-def xl w-full"
              >
                提 交
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    
</template>

<script>
import request, { base } from "../../../utils/http";
import store from "../../store";
import pagination from "../../components/Pagination";
 

var sj;
var intDiff;
var uid;
 
export default {
  components: { pagination },
  data() {
    return {
      zplist: "",
      dtid: 0,
      uid: "",
      formData: {},
      allRadio: [], //提交给后台 
      radio: [], //  答案
      hour: '',
      minute: '',
      second: '',
      timer: '',
   
      ksid: "",
    };
  },
 
    mounted () {
     
    },
  created() {
    this.ksid = this.$route.query.ksid;
 
    console.log(this.seconds + "  =====");
    var user = sessionStorage.getItem("currentUser");
    user = JSON.parse(user);
  
    uid = user.id;
 
 
      this.getList();


 
  },

  
 
  methods: {
    getIputValue(index) {
      this.allRadio[index] = this.radio[index];
     
    },
 
    submitDati() {
      var user = sessionStorage.getItem("currentUser");
 
      if (this.allRadio.length != this.zplist.length) {
        this.$message({
          message: "请先答题后提交！",
          type: "error",
        });
        return;
      }



      
      let para = {
        da: this.allRadio.toString(),
      };
      var user = sessionStorage.getItem("currentUser");
      user = JSON.parse(user);
      let url = base + "/xsksitem/add?ksid=" + this.ksid + "&uid=" + user.id;
      console.log(url);
      request.post(url, para).then((res) => {
        let code = res.code;
        if (code == 200) {
          window.location.href = "/kcinfo";
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
          });
          return;
        }
      });
    },

   

    getList(value) {
      let para = {};

      let url = base + "/timu/listTimuAll?ksid=" + this.ksid;
      console.log(url);
      request.post(url, para).then((res) => {
        this.zplist = res.resdata;
        for(var i=0;i<this.zplist.length;i++){
          // this.allRadio[i] = "";
           this.radio[i] = "";
        }

        console.log(this.allRadio + " ===")
      });
    },
  },
  
};

 
</script>

<style>
@import "../../assets/css/regiset.css";
</style>
 
