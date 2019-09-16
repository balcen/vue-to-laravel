# Excel to MySQL
上傳Excel資料到後端，必須使用限定的Excel格式
[Demo](upload.lpcen.com)

### 上傳
先將檔案用axios傳給後端分析，再回傳檔案的分類和row，用來驗證檔案是否正確，如果正確再將整個檔案再次傳回後端儲存。

### 瀏覽數據
使用Vuetify data table
* 即時查詢
* 自定義table的row
* 分頁
* 讀取資料的loading

### 數據CRUD
* 新增/修改 用一個dialog裡面的form來做新增跟修改的功能
* 多重刪除 `$emit`selected數組到上層component再取出id做成id string傳回後端

