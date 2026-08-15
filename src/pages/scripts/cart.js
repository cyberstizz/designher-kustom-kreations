// Page behaviour ported from the cart prototype. Runs once on mount.
export default function init() {
  (function(){
    var FREE_SHIP_THRESHOLD = 250;
    var FLAT_SHIP = 14;
  
    function currency(n){ return '$' + n.toFixed(2); }
  
    function recalc(){
      var items = Array.prototype.slice.call(document.querySelectorAll('#cartList .cart-item'));
      var subtotal = items.reduce(function(sum, el){ return sum + Number(el.dataset.price); }, 0);
      var shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIP_THRESHOLD ? 0 : FLAT_SHIP);
      var total = subtotal + shipping;
  
      document.getElementById('sumSubtotal').textContent = currency(subtotal);
      document.getElementById('sumTotal').textContent = currency(total);
      // The header cart badge was removed when pricing came off the site.
      // Guarded so this page keeps working if the badge ever returns.
      var badge = document.getElementById('cartBadge');
      if (badge) {
        badge.textContent = items.length;
        badge.hidden = items.length === 0;
      }
  
      var shipRow = document.getElementById('shipRow');
      var shipNote = document.getElementById('shipNote');
      if(subtotal >= FREE_SHIP_THRESHOLD && subtotal > 0){
        shipRow.classList.add('free');
        shipRow.querySelector('.sv').innerHTML = '<span class="strike">$' + FLAT_SHIP.toFixed(2) + '</span>Free';
        shipNote.textContent = "Free shipping unlocked — you're over $" + FREE_SHIP_THRESHOLD + '.';
        shipNote.style.display = 'block';
      } else if(subtotal > 0){
        shipRow.classList.remove('free');
        shipRow.querySelector('.sv').innerHTML = currency(FLAT_SHIP);
        var remaining = (FREE_SHIP_THRESHOLD - subtotal).toFixed(2);
        shipNote.textContent = 'Add $' + remaining + ' more for free shipping.';
        shipNote.style.display = 'block';
      } else {
        shipNote.style.display = 'none';
      }
  
      var isEmpty = items.length === 0;
      document.getElementById('emptyState').classList.toggle('show', isEmpty);
      document.getElementById('cartList').style.display = isEmpty ? 'none' : '';
      document.querySelector('.summary').style.display = isEmpty ? 'none' : '';
    }
  
    document.getElementById('cartList').addEventListener('click', function(e){
      var btn = e.target.closest('[data-remove]');
      if(!btn) return;
      var item = btn.closest('.cart-item');
      item.classList.add('removing');
      setTimeout(function(){
        item.remove();
        recalc();
      }, 320);
    });
  
    recalc();
  })();
}