<template>
 <el-config-provider :locale="locale">
    <div id="nongjitong_home">
        <div>
            <TopMenu/>
        </div>
        <router-view/>
    </div>
 </el-config-provider>
</template>

<style>

</style>

<script>
    import TopMenu from "../components/TopMenu";
    import { ElConfigProvider } from 'element-plus';
    import zhCn from 'element-plus/lib/locale/lang/zh-cn'
    export default {
        name:"IndexLayout",
        components:{
            TopMenu,
              [ElConfigProvider.name]: ElConfigProvider
        },
        data() {
            return {
                  locale: zhCn,
            }
        },
    }

 


</script>
<style>
 @import "../../assets/css/idangerous.swiper.css";
@import "../../assets/css/cmspc.min.css";
</style>