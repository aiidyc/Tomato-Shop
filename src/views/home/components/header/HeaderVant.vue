<template>
    <form action="/">
        <van-search
                v-model="value"
                placeholder="请输入搜索关键词"
                show-action
                @search="onSearch"
                @cancel="onCancel"
        />
    </form>
</template>

<script>
    export default {
        name: "HeaderVant",
        data(){
            return{
                value:''
            }
        },methods:{
            onSearch(value){
                alert(value)
            },
            onCancel(){
                alert(1)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>