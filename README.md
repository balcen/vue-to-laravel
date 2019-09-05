# Excel to MySQL

### 上傳
先將檔案用Axios直接傳給後端分析，再回傳檔案的分類和row，用來驗證檔案是否正確，如果正確再將整個檔案再次傳回後端儲存。

### 瀏覽數據
使用vuetify的data table，可以直接自定義row和分頁，也有查詢功能和loading。但是data table的分頁似乎還是一次性接收全部資料，開啟速度有點慢。

### 數據CRUD
這裡是直接模仿vuetify的CRUD範例做修改
* 新增/修改 用一個dialog裡面的form來做新增跟修改的功能
* 多重刪除 `$emit`selected數組到上層component再取出id做成id string傳回後端

