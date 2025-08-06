// dashboard.js 完整版
async function fetchJSON(url) {
  const res = await fetch(url);
  return res.json();
}

/* 留言 */
(async () => {
  const msgs = await fetchJSON('/admin/messages');
  const html = msgs.map(m => `
    <div style="display:flex;justify-content:space-between;border-bottom:1px solid #30363d;padding:.3rem 0">
      <span>${m.content}</span>
      <button onclick="delMsg('${m._id}')">删除</button>
    </div>
  `).join('');
  document.getElementById('msgList').innerHTML = html || '<p>暂无留言</p>';
})();

/* 商品 */
(async () => {
  const prods = await fetchJSON('/admin/products');
  const html = prods.map(p => `
    <div style="display:flex;justify-content:space-between;border-bottom:1px solid #30363d;padding:.3rem 0">
      <span>${p.title} - ¥${p.price} [${p.status}]</span>
      <span>
        <button onclick="toggleProd('${p._id}','${p.status}')">${p.status==='on'?'下架':'上架'}</button>
        <button onclick="delProd('${p._id}')">删除</button>
      </span>
    </div>
  `).join('');
  document.getElementById('prodList').innerHTML = html || '<p>暂无商品</p>';
})();

/* 订单 */
(async () => {
  const orders = await fetchJSON('/admin/orders');
  const html = orders.map(o => `
    <div style="display:flex;justify-content:space-between;border-bottom:1px solid #30363d;padding:.3rem 0">
      <span>${o.product} - ${o.email} - ${o.status}</span>
      <button onclick="markDone('${o._id}')">标记完成</button>
    </div>
  `).join('');
  document.getElementById('ordList').innerHTML = html || '<p>暂无订单</p>';
})();

/* 工具函数 */
async function delMsg(id)   { await fetch('/admin/messages/'   + id, {method:'DELETE'}); location.reload(); }
async function delProd(id)  { await fetch('/admin/products/'  + id, {method:'DELETE'}); location.reload(); }
async function toggleProd(id, status) {
  await fetch('/admin/products/' + id, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({status: status==='on'?'off':'on'})
  });
  location.reload();
}
async function markDone(id) {
  await fetch('/admin/orders/' + id, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({status:'done'})
  });
  location.reload();
}