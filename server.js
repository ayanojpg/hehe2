var express = require("express");
var server = express();
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");//下載資料庫

server.set("view engine", 'ejs');//渲染訊息的套件
server.set("views", __dirname+"/view")



server.use(express.static(__dirname + "/Public"));
// 設定靜態資源資料夾 __dirname 表示目前這個檔案的資料夾路徑/Public" 是你的靜態資源資料夾瀏覽器訪問 http://localhost:3000/img.png 會自動對應到 /Public/img.png
server.use(bodyParser.urlencoded({ extended: true }));
//設定 body-parser 解析表單資料（x-www-form-urlencoded）- extended: true → 可以解析複雜的資料結構（nested objects） 允許 req.body 讀取 POST 表單送過來的資料
server.use(bodyParser.json());
//// 設定 body-parser 解析 JSON 資料允許 req.body 讀取 POST / PUT 傳送的 JSON 很常用於 API
server.use(fileUpload({limits:{fileSize:2*1024*1024}}))
//// 設定 express-fileupload 處理檔案上傳 limits.fileSize = 限制上傳檔案大小，這裡是 2MB req.files 可以拿到上傳的檔案

var DB=require("nedb-promises");
// 引入 nedb-promises（輕量型資料庫，支援 Promise）




var ueueDB = DB.create(__dirname+"/ueue.db");
// 建立 /ueue.db 資料庫 __dirname + "/ueue.db" → 存放資料的檔案路徑 ueueDB 可以用 await ueueDB.insert(), find() 等操作
var fuuckyouDB = DB.create(__dirname+"/fuuckyou.db");
// 建立 /fuuckyou.db 資料庫同上，建立另一個資料庫 




// 當前端 GET 請求 /ueue 路徑時會觸發
server.get("/ueue", (req, res) => {
   // 從 ueueDB 資料庫查詢所有資料 查詢條件，空物件表示全部都抓抓 投影（projection），_id 欄位不回傳 results 是陣列，包含所有資料列
    ueueDB.find({},{_id:0}).then(results=>{
       
        res.send(results);
    }).catch(error=>{

    })
    })





server.post("/fuuckyou", (req, res) =>{
    console.log("耶比:", req.body);
    fuuckyouDB.insert(req.body).catch(err => console.log(err));    // 將 req.body 新增到 fuuckyouDB 資料庫


    if(req.files && req.files.myFile1){     // 偵測並檢查是否有上傳檔案
        var upFile=req.files.myFile1;
        upFile.mv(__dirname+"/Public/upload/"+upFile.name, function(err){
            if(err){
                res.render("msg",{message:"呵呵失敗了: "+err});
            }else{
                res.render("msg",{message:"謝謝: "+upFile.name});
            }
        });
    }else{
        res.render("msg",{message:"沒有檔案但我收到ㄌ"});
    }
});
//有fuukyou.db有fuukyou.db有fuukyou.db有fuukyou.db有fuukyou.db有fuukyou.db有fuukyou.db有fuukyou.db有fuukyou.db有fuukyou.db有fuukyou.db

server.post("/ueue", (req, res) =>{
        

    console.log("耶比:", req.body);// 先在後端 console.log 輸出收到的資料（方便偵錯
    fuuckyouDB.insert(req.body).catch(err => console.log(err));
    // 將 req.body 先插入 fuuckyouDB 資料庫（不包含圖片路徑） - insert()：新增一筆資料.catch()：若出現錯誤會印出 這裡先插入的是文字資料，不包含圖片

    if(req.files && req.files.ueueue){
        var upFile=req.files.ueueue;// 取得上傳的檔案物件
        var savePath = "/img/"+upFile.name;// 設定要存到資料庫的圖片路徑
        req.body.ueueue = savePath;//在資料庫內儲存圖片路徑

        // 將檔案移動到指定路徑 (__dirname + "/Public/img/")
        upFile.mv(__dirname+"/Public/img/"+upFile.name, function(err){
            if(err){
                res.render("msg",{message:"失敗: "+err});
            }else{
                res.render("msg",{message:"圖片上傳成功: "+upFile.name});
                ueueDB.insert(req.body).catch(err => console.log(err)); // 將包含圖片路徑的資料加入 ueueDB
            }
        });
    }else{
        res.render("msg",{message:"已收到,沒有圖片也OK"});// 如果沒有上傳檔案，也直接回傳訊息告訴上傳者有收到
    }
});

server.listen(8080)