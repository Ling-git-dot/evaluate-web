<template>
    <el-menu
           style="width:220px; min-height : calc(100vh - 90px)"
           router
             default-active="admin"
            class="el-menu-vertical-demo" >
        <el-submenu index="1" style="width:220px;" v-if="utype=='管理员'" >
            <template #title>
                <i class="el-icon-s-home"></i>
                <span>系统管理</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="admin">管理员管理</el-menu-item>
                <el-menu-item index="updatePwd">修改密码</el-menu-item>
            </el-menu-item-group>
        </el-submenu>

        
        <el-menu-item index="bminfo"  v-if="utype=='管理员'">
            <i class="el-icon-files"></i>
            <template #title>部门管理</template>
        </el-menu-item>
        <el-menu-item index="bjinfo"  v-if="utype=='管理员'">
            <i class="el-icon-film"></i>
            <template #title>班级管理</template>
        </el-menu-item>

       <el-menu-item index="userinfo"  v-if="utype=='管理员'">
            <i class="el-icon-office-building"></i>
            <template #title>教师信息管理</template>
        </el-menu-item>
        
       <el-menu-item index="student"  v-if="utype=='管理员'">
            <i class="el-icon-user"></i>
            <template #title>学生信息管理</template>
        </el-menu-item>

        <el-menu-item index="kcinfo"  v-if="utype=='管理员'">
            <i class="el-icon-wallet"></i>
            <template #title>课程管理</template>
        </el-menu-item>

        <el-menu-item index="kcbjinfo"  v-if="utype=='管理员'">
            <i class="el-icon-school"></i>
            <template #title>班级教师课程管理</template>
        </el-menu-item>
      
        <el-menu-item index="timu"  v-if="utype=='管理员'">
            <i class="el-icon-setting"></i>
            <template #title>问卷设置</template>
        </el-menu-item>
      

 

     

       <el-menu-item index="updateStudent"  v-if="utype=='学生'">
            <i class="el-icon-s-custom"></i>
            <template #title>个人资料</template>
        </el-menu-item>

           <el-menu-item index="kcinfo"  v-if="utype=='学生'">
            <i class="el-icon-files"></i>
            <template #title>班级课程</template>
        </el-menu-item>

     



        <el-menu-item index="updateUinfo"  v-if="utype=='老师'">
            <i class="el-icon-s-custom"></i>
            <template #title>个人资料</template>
        </el-menu-item>

           <el-menu-item index="kcinfo"  v-if="utype=='老师'">
            <i class="el-icon-user"></i>
            <template #title>我的课程</template>
        </el-menu-item>
      

 

 
         
       

          

    </el-menu>
</template>

<script>
export default {
  name: "LeftMenu",
  data() {
    return {
      utype: '' 
    };
    
  },
  created() {
     let utype = sessionStorage.getItem('utype');
     this.utype = utype;
     
  },
};
</script>

<style scoped>

</style>