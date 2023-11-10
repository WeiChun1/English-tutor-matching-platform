# 英文家教媒合平台

這是一個家教媒合平台，每個使用者都可以選擇自己要當學生或老師，老師可以開各時段的課程供學生們選擇，上完課後會有評分回饋。

## 功能

- 使用者註冊/登入： 使用者需註冊或登入後才可使用網站，可以直接在網站上申請或是使用第三方登入(facebook、google)。

- 主頁： 使用者可以看到全部老師所開設的課程與簡述，可以點選進去看詳細資訊跟可預約的課程，也有查詢功能可以找到自己喜歡的老師或課程內容。 

- 成為家教： 使用者剛註冊完會是學生，如果想成為老師，需點擊導覽列的成為老師，填相關資料與開課時間，就可以轉換身分了。

- 瀏覽/編輯個人介面： 點入後可以看到自己的個人資料，老師和學生的頁面會有些許不同，學生頁面還會有最近上完的課程可以評論，如果想修改資料右下有編輯鍵，可以改變自己的資料。

- 預約課程： 當學生點進老師資料時，可以看到老師現在未被選擇的課程時段，如果想上可以選好時段送出，就完成預約。

- 後台： 供管理者可以看到全部使用者的資訊。

## 環境
Node.js 和 npm 先安裝於電腦。

## 安裝

1. 將專案clone到本地:
```
git clone https://github.com/WeiChun1/English-tutor-matching-platform.git
```
2. 在本地開啟專案:
```
cd English-tutor-matching-platform
```
3. 下載相關套件:
```
npm install
```
4. 建立資料模型:
```
npx sequelize db:migrate
```
5. 載入種子資料:
```
npx sequelize db:seed:all
```
6. 啟動:
```
npm run dev
```

## 測試帳號
可使用以下三個帳號進行各種身分的測試
- 管理者  
  帳號: root@example.com  
  密碼: 12345678
- user1 (user1~user15)
  身分: 學生  
  帳號: user1@example.com  
  密碼: 12345678
- user16 (user16~user40)
  身分: 老師  
  帳號: user16@example.com  
  密碼: 12345678