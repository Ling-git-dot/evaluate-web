<template>
  <el-form
    ref="formDataRef"
    :rules="rules"
    :model="formData"
    label-width="120px"
    style="margin-top: 20px; margin-left: 20px"
  >
 

  <el-form-item label="学号" prop="sno">
          <el-input v-model="formData.sno" readonly="true"  ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="upwd">
          <el-input v-model="formData.upwd" type="password"  ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name"  ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="formData.sex"
            placeholder="请选择"
            
          >
            <el-option label="男" value="男"> </el-option>
             <el-option label="女" value="女"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="formData.age"  ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="formData.tel" ></el-input>
        </el-form-item>
       


    <el-form-item>
      <el-button type="primary" :loading="btnLoading" @click="save"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import request, { base } from "../../../utils/http";

export default {
  name: "UpdateUinfo",

  data() {
   
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$/;
      if (!value) {
        return callback(new Error("联系电话不能为空"));
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("联系电话格式不正确"));
          }
        }
      }, 100);
    };
    
    return {
      btnLoading: false, //保存按钮加载状态
      formData: {},
        hyztinfoList: "",
      sqrxzList: "",
      rules: {
        sno: [
          { required: true, message: "请输入学号", trigger: "blur" }
        ],
        upwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        tel: [{ required: true, message: "请输入电话", trigger: "blur" }],
          
      },
    };
  },
  mounted() {
    var user = sessionStorage.getItem("currentUser");
    this.formData = JSON.parse(user);
 
  },
  methods: {
    
    save() {
      this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            let url = base + "/userinfo/update?id=" + this.formData.id;
            this.btnLoading = true;
            request.post(url, this.formData).then((res) => {
              if (res.code == 200) {
                this.btnLoading = false;
                this.formVisible = false;
                this.$message({
                  message: "修改成功，请重新登录",
                  type: "success",
                  offset: 320,
                });
                 sessionStorage.removeItem("currentUser");
		             sessionStorage.removeItem("utype");
                 window.location.href="/login"
         
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
    },
  },
};
</script>

<style scoped>
</style>