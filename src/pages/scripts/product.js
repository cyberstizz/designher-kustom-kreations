// Page behaviour ported from the product prototype. Runs once on mount.
export default function init() {
  (function(){
    var selectedSize = null;
  
    // gallery thumbs
    document.querySelectorAll('.thumb[data-src]').forEach(function(t){
      t.addEventListener('click', function(){
        document.querySelectorAll('.thumb').forEach(function(x){x.classList.remove('active');});
        t.classList.add('active');
        document.getElementById('mainImg').src = t.dataset.src;
      });
    });
  
    // size pills
    document.getElementById('sizeRow').addEventListener('click', function(e){
      var pill = e.target.closest('.size-pill');
      if(!pill) return;
      document.querySelectorAll('.size-pill').forEach(function(p){p.classList.remove('selected');});
      pill.classList.add('selected');
      selectedSize = pill.dataset.size;
      document.getElementById('sizeErr').classList.remove('show');
    });
  
    function showToast(msg){
      var toast = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = msg;
      toast.classList.add('show');
      clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 2400);
    }
  
    function requireSize(){
      if(!selectedSize){
        document.getElementById('sizeErr').classList.add('show');
        document.getElementById('sizeRow').scrollIntoView({behavior:'smooth', block:'center'});
        return false;
      }
      return true;
    }
  
    // Add-to-bag and Buy-now were removed when pricing came off the site.
    // Size selection still runs so the chosen size can be prefilled into the
    // custom-order form later.

    // accordions
    document.querySelectorAll('#pdpAccordions .faq-q').forEach(function(q){
      q.addEventListener('click', function(){
        var item = q.closest('.faq-item');
        var a = item.querySelector('.faq-a');
        var open = item.classList.contains('open');
        document.querySelectorAll('#pdpAccordions .faq-item.open').forEach(function(i){
          i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null;
        });
        if(!open){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });
  })();
}