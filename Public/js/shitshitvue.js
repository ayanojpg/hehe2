
const { createApp, ref } = Vue;

var ueueApp=createApp({
    data(){
        return{
            ueue: []
        }
    }
}).mount("#ueue");

//req ueue data fromm server
$.ajax({
    url:"/ueue",
    method:"get",
    dataType:"json",
    success: (result)=>{
        ueueApp.ueue = result;
    }
})



var portfolioApp=createApp({
    setup(){
        return{
            Portfolio: ref([])
        }
    }
}).mount("#aaaaa");

$.ajax({
    url:"/aaaaa",
    method:"get",
    dataType:"json",
    success: (result)=>{
        portfolioApp.Portfolio = result;
    }
})
