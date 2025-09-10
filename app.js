// ===== Utilities =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const uid = () => Math.random().toString(36).slice(2, 9);
const toast = (msg) => {
  const t = document.createElement('div');
  t.className = 't';
  t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => t.remove(), 2200);
};

// ===== Storage =====
const db = {
  get(key, def){ try{ return JSON.parse(localStorage.getItem(key)) ?? def }catch{ return def } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); },
};

// ===== Auth / Profile =====
let user = db.get('user', null);
const saveUser = () => {
  user = {
    name: $('#authName').value.trim(),
    email: $('#authEmail').value.trim(),
    hostel: $('#authHostel').value.trim(),
    branch: $('#authBranch').value.trim(),
    upi: user?.upi || '', // can edit in profile later
    id: user?.id || uid(),
    rating: user?.rating || 4.6,
    ratedBy: user?.ratedBy || 10,
  };
  db.set('user', user);
  updateBadge();
  renderProfile();
  toast('Logged in locally.');
};
const logout = () => { user=null; db.set('user', null); updateBadge(); renderProfile(); toast('Logged out.'); };
const isVerified = (email) => /\.(edu|ac\.in)$/i.test(email || '');
const updateBadge = () => { $('#userBadge').textContent = user ? (user.name || 'User') + (isVerified(user.email) ? ' ✅' : '') : 'Guest'; };

// ===== Seed Listings =====
const seed = () => [
  { id: uid(), title:'Discrete Mathematics – Kenneth Rosen', cat:'Books', price:350, cond:'Used', desc:'CSE second-year book, few highlights.', img:'https://picsum.photos/seed/book/600/400', seller:'Amit', sellerId: uid(), hostel:'BH-3', methods:['UPI','Cash'], exchange:'No', reports:0, rating:4.8 },
  { id: uid(), title:'Arduino Uno (with cables)', cat:'Lab Equipment', price:900, cond:'Like New', desc:'Used for one semester only.', img:'https://picsum.photos/seed/arduino/600/400', seller:'Priya', sellerId: uid(), hostel:'GH-1', methods:['UPI'], exchange:'Exchange', reports:0, rating:4.5 },
  { id: uid(), title:'Handwritten DSA Notes', cat:'Notes', price:120, cond:'Like New', desc:'Clean, indexed by topics.', img:'https://picsum.photos/seed/notes/600/400', seller:'Rahul', sellerId: uid(), hostel:'BH-2', methods:['UPI','Cash'], exchange:'No', reports:0, rating:4.2 },
  { id: uid(), title:'Casio Scientific Calculator', cat:'Gadgets', price:450, cond:'Used', desc:'FX-991ES Plus.', img:'https://picsum.photos/seed/calc/600/400', seller:'Sneha', sellerId: uid(), hostel:'GH-2', methods:['Cash'], exchange:'Free/Donation', reports:0, rating:4.9 },
];
let items = db.get('items', null);
if(!items){ items = seed(); db.set('items', items); }
let wishlist = db.get('wishlist', []);
let chats = db.get('chats', {}); // {itemId: [{from:'me'|'them', text, ts}]}
let reports = db.get('reports', []);

// ===== Tabs =====
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>{
  $$('.tabs button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  $$('.tab').forEach(t=>t.classList.add('hide'));
  $('#tab-'+b.dataset.tab).classList.remove('hide');
  if(b.dataset.tab==='chat') renderChatList();
  if(b.dataset.tab==='admin') renderAdmin();
  if(b.dataset.tab==='wishlist') renderWishlist();
  if(b.dataset.tab==='market') renderMarket();
  if(b.dataset.tab==='profile') renderProfile();
}));

// ===== Filters =====
const getFilters = () => ({
  q: $('#q').value.trim().toLowerCase(),
  cat: $('#fCategory').value,
  cond: $('#fCondition').value,
  min: Number($('#fMin').value || 0),
  max: Number($('#fMax').value || 1e9),
  hostel: $('#fHostel').value.trim().toLowerCase(),
});
$('#btnFilter').onclick = () => renderMarket();
$('#btnReset').onclick = () => {
  ['q','fCategory','fCondition','fMin','fMax','fHostel'].forEach(id=>$('#'+id).value='');
  renderMarket();
};

// ===== Market Render =====
const inWish = (id)=> wishlist.includes(id);
const toggleWish = (id)=>{ if(inWish(id)) wishlist = wishlist.filter(x=>x!==id); else wishlist.push(id); db.set('wishlist', wishlist); renderMarket(); toast(inWish(id)?'Saved to wishlist':'Removed'); };
const reportItem = (it)=>{ it.reports=(it.reports||0)+1; reports.push({id:it.id,title:it.title,ts:Date.now()}); db.set('items', items); db.set('reports', reports); toast('Reported. Admin will review.'); renderMarket(); };
const openChat = (it)=>{
  $$('.tabs button').forEach(x=>x.classList.remove('active'));
  $$('[data-tab=\"chat\"]').forEach(x=>x.classList.add('active'));
  $$('.tab').forEach(t=>t.classList.add('hide'));
  $('#tab-chat').classList.remove('hide');
  renderChatList();
  loadChat(it.id, it.title);
};
function renderMarket(){
  const f = getFilters();
  const list = $('#marketList'); list.innerHTML='';
  let filtered = items.filter(it=>{
    const text = (it.title+' '+it.desc+' '+it.seller).toLowerCase();
    const ok = (!f.q || text.includes(f.q)) &&
               (!f.cat || it.cat===f.cat) &&
               (!f.cond || it.cond===f.cond) &&
               (it.price>=f.min && it.price<=f.max) &&
               (!f.hostel || (it.hostel||'').toLowerCase().includes(f.hostel));
    return ok;
  });
  $('#countText').textContent = `${filtered.length} item(s)`;
  $('#emptyMarket').classList.toggle('hide', filtered.length>0);
  for(const it of filtered){
    const el = document.createElement('div');
    el.className='item card';
    el.innerHTML = `
      <img src="${it.img}" alt="${it.title}"/>
      <div class="space"><strong>${it.title}</strong><span class="price">₹${it.price}</span></div>
      <div class="space small muted"><span>${it.cat} • ${it.cond}</span><span>${it.hostel||'—'}</span></div>
      <div class="small">By ${it.seller} <span class="badge">${it.rating.toFixed(1)}★</span> ${isVerifiedBySeller(it) ? '✅' : ''}</div>
      <p class="small muted">${it.desc}</p>
      <div class="space small"><span class="pill">${it.exchange}</span><span>Pay: ${it.methods.join(', ')}</span></div>
      <div class="space">
        <div class="toolbar">
          <button class="btn" data-act="chat">Chat</button>
          <button class="btn ghost" data-act="offer">Offer</button>
          <button class="btn warn" data-act="report">Report</button>
        </div>
        <button class="btn ${inWish(it.id)?'danger':'good'}" data-act="wish">${inWish(it.id)?'− Wishlist':'+ Wishlist'}</button>
      </div>
    `;
    el.querySelector('[data-act="wish"]').onclick=()=>toggleWish(it.id);
    el.querySelector('[data-act="report"]').onclick=()=>reportItem(it);
    el.querySelector('[data-act="chat"]').onclick=()=>openChat(it);
    el.querySelector('[data-act="offer"]').onclick=()=>{ openChat(it); $('#chatMsg').value = `Offer ₹${Math.max(0, it.price-50)}`; };
    list.appendChild(el);
  }
}
const isVerifiedBySeller = (it)=>{
  // heuristic: demo sellers 'Priya' & 'Sneha' verified
  return ['Priya','Sneha'].includes(it.seller);
};

// ===== Sell Form =====
$('#btnPost').onclick = async ()=>{
  if(!user){ toast('Login first.'); return; }
  const title = $('#sTitle').value.trim();
  const price = Number($('#sPrice').value||0);
  if(!title || price<=0){ toast('Title & valid price required.'); return; }
  let imgData = '';
  const file = $('#sImg').files[0];
  if(file){
    imgData = await new Promise(res=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(file); });
  }else{
    imgData = 'https://picsum.photos/seed/'+uid()+'/600/400';
  }
  const it = {
    id: uid(), title, cat: $('#sCategory').value, price, cond: $('#sCondition').value,
    desc: $('#sDesc').value.trim(), img: imgData, seller: user.name||'You', sellerId: user.id,
    hostel: user.hostel||'', methods: [$('#pmUPI').checked?'UPI':null,$('#pmCash').checked?'Cash':null].filter(Boolean),
    exchange: $('#sExchange').value, reports:0, rating: 4.5
  };
  items.unshift(it); db.set('items', items);
  toast('Listing posted.'); renderMarket(); clearSell();
};
const clearSell = ()=>['sTitle','sPrice','sDesc','sImg'].forEach(id=>$('#'+id).value='');
$('#btnClearSell').onclick = clearSell;

// ===== Wishlist =====
function renderWishlist(){
  const list = $('#wishList'); list.innerHTML='';
  const its = items.filter(it=>wishlist.includes(it.id));
  $('#emptyWish').classList.toggle('hide', its.length>0);
  for(const it of its){
    const el = document.createElement('div');
    el.className='item card';
    el.innerHTML = `
      <img src="${it.img}" alt="${it.title}"/>
      <div class="space"><strong>${it.title}</strong><span class="price">₹${it.price}</span></div>
      <div class="space small muted"><span>${it.cat} • ${it.cond}</span><span>${it.hostel||'—'}</span></div>
      <div class="toolbar">
        <button class="btn good" data-act="chat">Chat</button>
        <button class="btn danger" data-act="remove">Remove</button>
      </div>`;
    el.querySelector('[data-act="chat"]').onclick=()=>openChat(it);
    el.querySelector('[data-act="remove"]').onclick=()=>{ wishlist = wishlist.filter(x=>x!==it.id); db.set('wishlist', wishlist); renderWishlist(); toast('Removed'); };
    list.appendChild(el);
  }
}

// ===== Chat =====
function renderChatList(){
  const list = $('#chatList'); list.innerHTML='';
  const keys = Object.keys(chats);
  $('#chatEmpty').classList.toggle('hide', keys.length>0);
  for(const id of keys){
    const it = items.find(x=>x.id===id);
    if(!it) continue;
    const last = chats[id][chats[id].length-1];
    const el = document.createElement('div');
    el.className='chat-card';
    el.innerHTML = `<div class="space"><strong>${it.title}</strong><span class="small muted">${it.seller}</span></div>
                    <div class="small muted">${last?.from==='me'?'You: ':'Seller: '}${last?.text||'Start chatting'}</div>
                    <div class="toolbar"><button class="btn brand">Open</button></div>`;
    el.querySelector('button').onclick=()=>loadChat(it.id, it.title);
    list.appendChild(el);
  }
}
let currentChat = null;
function loadChat(id, title){
  currentChat = id;
  $('#chatBox').classList.remove('hide');
  $('#chatHeader').textContent = title;
  $('#chatThread').innerHTML='';
  chats[id] = chats[id] || [];
  for(const m of chats[id]) addMsg(m.from, m.text);
}
function addMsg(from, text){
  const b = document.createElement('div');
  b.className='msg ' + (from==='me'?'me':'them');
  b.textContent = text;
  $('#chatThread').appendChild(b);
  $('#chatThread').scrollTop = 999999;
}
$('#btnSend').onclick = ()=>{
  if(!user){ toast('Login first.'); return; }
  const text = $('#chatMsg').value.trim();
  if(!text) return;
  chats[currentChat] = chats[currentChat] || [];
  chats[currentChat].push({from:'me', text, ts:Date.now()});
  db.set('chats', chats);
  addMsg('me', text);
  $('#chatMsg').value='';
  // simple auto reply
  setTimeout(()=>{
    const reply = text.toLowerCase().includes('offer') ? 'Thanks! I will consider your offer.' : 'Sure, when would you like to meet?';
    chats[currentChat].push({from:'them', text: reply, ts:Date.now()});
    db.set('chats', chats);
    addMsg('them', reply);
  }, 600);
};

// ===== Admin =====
function renderAdmin(){
  const list = $('#adminList'); list.innerHTML='';
  $('#adminEmpty').classList.toggle('hide', items.length>0);
  for(const it of items){
    const el = document.createElement('div');
    el.className='item card';
    el.innerHTML = `
      <div class="space"><strong>${it.title}</strong><span class="badge">${it.cat}</span></div>
      <div class="small muted">Reports: ${it.reports||0}</div>
      <div class="toolbar">
        <button class="btn ghost" data-act="view">View</button>
        <button class="btn danger" data-act="remove">Remove</button>
      </div>`;
    el.querySelector('[data-act="remove"]').onclick=()=>{ items = items.filter(x=>x.id!==it.id); db.set('items', items); renderAdmin(); renderMarket(); toast('Listing removed'); };
    el.querySelector('[data-act="view"]').onclick=()=>{ alert(`${it.title}\n₹${it.price}\n${it.desc}`); };
    list.appendChild(el);
  }
}

// ===== Profile =====
function renderProfile(){
  const box = $('#profileBox');
  if(!user){ box.innerHTML = '<p class="muted">Not logged in.</p>'; return; }
  box.innerHTML = `
    <div class="card">
      <div class="space"><strong>${user.name||'User'}</strong> <span class="badge">${isVerified(user.email)?'Verified ✅':'Unverified'}</span></div>
      <div class="small muted">${user.email||''}</div>
      <div class="small muted">${user.branch||''} • ${user.hostel||''}</div>
      <div class="grid two" style="margin-top:10px">
        <label class="field"><span>UPI ID (optional)</span><input id="pUpi" value="${user.upi||''}" placeholder="user@upi"/></label>
        <label class="field"><span>Name</span><input id="pName" value="${user.name||''}"/></label>
        <label class="field"><span>Email</span><input id="pEmail" value="${user.email||''}"/></label>
        <label class="field"><span>Branch/Year</span><input id="pBranch" value="${user.branch||''}"/></label>
        <label class="field"><span>Hostel</span><input id="pHostel" value="${user.hostel||''}"/></label>
      </div>
      <div class="toolbar">
        <button id="btnSaveProfile" class="btn good">Save</button>
      </div>
    </div>
  `;
  $('#btnSaveProfile').onclick = ()=>{
    user.upi = $('#pUpi').value.trim();
    user.name = $('#pName').value.trim();
    user.email = $('#pEmail').value.trim();
    user.branch = $('#pBranch').value.trim();
    user.hostel = $('#pHostel').value.trim();
    db.set('user', user);
    updateBadge();
    toast('Profile saved.');
  };
}

// ===== Events =====
$('#btnLogin').onclick = saveUser;
$('#btnLogout').onclick = logout;

// Init fill form if user present
if(user){
  $('#authName').value = user.name||'';
  $('#authEmail').value = user.email||'';
  $('#authHostel').value = user.hostel||'';
  $('#authBranch').value = user.branch||'';
}
updateBadge();
renderMarket();
