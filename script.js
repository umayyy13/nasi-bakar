// Nomor WA Penjual (Ganti ke nomor kamu, gunakan format 62)
const WA_NUMBER = "+62895384464932";

// Data Katalog Nasi Bakar
const products = [
  { id: 1, name: "Nasi Bakar Ayam Suwir", price: 15000, img: "https://via.placeholder.com/300x150?text=Nasi+Bakar+Ayam" },
  { id: 2, name: "Nasi Bakar Cumi Pedas", price: 18000, img: "https://via.placeholder.com/300x150?text=Nasi+Bakar+Cumi" },
  { id: 3, name: "Nasi Bakar Teri Medan", price: 14000, img: "https://via.placeholder.com/300x150?text=Nasi+Bakar+Teri" },
  { id: 4, name: "Nasi Bakar Tongkol Balado", price: 16000, img: "https://via.placeholder.com/300x150?text=Nasi+Bakar+Tongkol" }
];

let cart = {};

// Render Produk ke HTML
function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = products.map(p => `
    <div class="card">
      <div>
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">Rp${p.price.toLocaleString('id-ID')}</p>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateQty(${p.id}, -1)">-</button>
        <span class="qty-val" id="qty-${p.id}">0</span>
        <button class="qty-btn" onclick="updateQty(${p.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

// Update Jumlah Pesanan
function updateQty(id, change) {
  if (!cart[id]) cart[id] = 0;
  cart[id] += change;

  if (cart[id] < 0) cart[id] = 0;

  document.getElementById(`qty-${id}`).innerText = cart[id];
  calculateTotal();
}

// Hitung Total Bayar
function calculateTotal() {
  let total = 0;
  products.forEach(p => {
    if (cart[p.id]) {
      total += cart[p.id] * p.price;
    }
  });
  document.getElementById("grand-total").innerText = total.toLocaleString('id-ID');
}

// Format & Kirim ke WhatsApp
function sendToWA() {
  const nama = document.getElementById("nama").value.trim();
  const catatan = document.getElementById("catatan").value.trim();

  let itemsText = "";
  let total = 0;

  products.forEach(p => {
    const qty = cart[p.id] || 0;
    if (qty > 0) {
      const subtotal = qty * p.price;
      total += subtotal;
      itemsText += `- ${p.name} (${qty}x) = Rp${subtotal.toLocaleString('id-ID')}\n`;
    }
  });

  if (total === 0) {
    alert("Pilih minimal 1 menu nasi bakar terlebih dahulu!");
    return;
  }

  if (!nama) {
    alert("Silakan isi nama kamu terlebih dahulu.");
    return;
  }

  // Rakit Pesan
  let text = `Halo, saya mau pesan Nasi Bakar:\n\n`;
  text += itemsText;
  text += `\n*Total: Rp${total.toLocaleString('id-ID')}*\n\n`;
  text += `*Nama:* ${nama}\n`;
  text += `*Alamat/Catatan:* ${catatan ? catatan : '-'}`;

  // Encode URL agar aman diarahkan ke WhatsApp
  const encodedText = encodeURIComponent(text);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodedText}`;

  window.open(waUrl, '_blank');
}

// Inisialisasi Tampilan saat halaman dimuat
renderProducts();