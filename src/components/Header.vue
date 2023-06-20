<template>
  <div id="header">
    <div id="menu">
      <div id="logo">
        <div id="system_title">教师评价系统</div>
      </div>
      <div id="rinfo">
        


        当前用户：
        <span>{{ userName }} </span>
        <span id="exit">
          <a @click="exit">退出</a>
        </span>

      

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      userName: "",
      utype: "",
    };
  },
  mounted() {
    var utype = sessionStorage.getItem("utype");
    this.utype = utype || "";
    if (utype == "管理员") {
      var user = sessionStorage.getItem("currentUser");
      user = JSON.parse(user);
      if (user) {
        this.userName = user.name || "";
      }
    }
     if (utype != "管理员") {
      var user = sessionStorage.getItem("currentUser");
      user = JSON.parse(user);
      if (user) {
        if (utype == "老师"){
          this.userName = user.sno || "" ;
          this.userName  = this.userName + " "+ user.name   + "【"+utype+"】";
        }else{
          this.userName = user.sno || "" ;
          this.userName  = this.userName + " "+ user.name  + "("+user.bjinfoVO.name+")"  + "【"+utype+"】";
        }
        
      }
    }
  },
  methods: {
 
    exit: function () {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sessionStorage.removeItem("currentUser");
  
          sessionStorage.removeItem("utype");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
</style>