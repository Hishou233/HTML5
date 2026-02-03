// 這支 script 會在「瀏覽器」中執行，而不是在 Node.js 中執行
//（負責從後端抓資料並更新網頁上的內容，不是直接操作資料庫。）
// 1. 定義一個函式來載入並顯示留言
async function loadMessages() {
    try { // 捕捉可能的錯誤
        // 2. 使用 fetch 向伺服器的 /api/messages 路徑發送 HTTP GET 請求，請求留言資料
        //   （const：把伺服器回傳的結果存起來。）
        const response = await fetch('/api/messages');       
        // 3. 將後端傳來的 JSON 回應轉為 JavaScript 陣列
        const messages = await response.json();
        // 4. 取得要放置留言的容器
        const listDiv = document.getElementById('messages-list');       
        // 5. (重要) 每次載入留言前先清空容器，避免重複堆疊舊的留言
        listDiv.innerHTML = '';
        // 6. 遍歷 (loop) 留言陣列
        if (messages.length === 0) {
            listDiv.innerHTML = '<p>目前沒有留言。</p>';
        } else {
            messages.forEach(message => {
                // 建立一個新的 div 元素，並加上 class 名稱
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message-item';               
                // 處理時間格式
                const time = new Date(message.created_at).toLocaleString();
                // 動態生成留言的 HTML 結構 
                messageDiv.innerHTML = `
                    <p><strong>${message.username}</strong> 說：</p>
                    <p>${message.content}</p>
                    <small>${time}</small>
                `;
                // 把每個留言 div 加入到 messages-list 容器裡
                listDiv.appendChild(messageDiv);
            });
        }
    } catch (error) {
        console.error('載入留言失敗:', error);
        document.getElementById('messages-list').innerHTML = '<p>載入留言失敗！</p>';
    }
}
// 7. 網頁載入完成時，自動執行 `loadMessages` 函式
document.addEventListener('DOMContentLoaded', loadMessages);
