// Page behaviour ported from the shop prototype. Runs once on mount.
export default function init() {
  (function(){
    var grid = document.getElementById('shopGrid');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.product-card'));
    var activeCat = 'all';
  
    function applyFilter(){
      var visible = 0;
      cards.forEach(function(c){
        var match = activeCat === 'all' || c.dataset.cat === activeCat;
        c.classList.toggle('hidden', !match);
        if(match) visible++;
      });
      document.getElementById('resultCount').textContent = visible + (visible === 1 ? ' kreation' : ' kreations');
    }
  
    document.getElementById('pillRow').addEventListener('click', function(e){
      var pill = e.target.closest('.pill');
      if(!pill) return;
      document.querySelectorAll('.pill').forEach(function(p){p.classList.remove('active');});
      pill.classList.add('active');
      activeCat = pill.dataset.cat;
      applyFilter();
    });
  
    document.getElementById('sortSelect').addEventListener('change', function(){
      var val = this.value;
      var sorted = cards.slice();
      if(val === 'low') sorted.sort(function(a,b){ return Number(a.dataset.price) - Number(b.dataset.price); });
      else if(val === 'high') sorted.sort(function(a,b){ return Number(b.dataset.price) - Number(a.dataset.price); });
      else return applyFilter(); // featured = original DOM order, no reorder needed
      sorted.forEach(function(c){ grid.appendChild(c); });
      applyFilter();
    });
  
    applyFilter();
  })();
}
