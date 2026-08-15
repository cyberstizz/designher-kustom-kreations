// Page behaviour ported from the custom prototype. Runs once on mount.
export default function init() {
  (function(){
    var state = {
      base: null, occasion: null, palette: null,
      personalization: '', fileName: '', size: '', timeline: '', budget: '',
      fullName: '', email: '', phone: '', shipState: ''
    };
    var current = 1;
    var TOTAL = 4;
  
    function setStep(n){
      current = n;
      document.querySelectorAll('.step-panel').forEach(function(p){
        p.classList.toggle('active', Number(p.dataset.panel) === n);
      });
      document.querySelectorAll('.tracker-step').forEach(function(t){
        var s = Number(t.dataset.step);
        t.classList.toggle('active', s === n);
        t.classList.toggle('done', s < n);
      });
      window.scrollTo({top: document.getElementById('tracker').offsetTop - 90, behavior:'smooth'});
    }
  
    document.getElementById('baseGrid').addEventListener('click', function(e){
      var card = e.target.closest('.option-card');
      if(!card) return;
      document.querySelectorAll('#baseGrid .option-card').forEach(function(c){c.classList.remove('selected');});
      card.classList.add('selected');
      state.base = card.dataset.value;
      document.getElementById('err1').style.display = 'none';
    });
  
    document.getElementById('occasionRow').addEventListener('click', function(e){
      var chip = e.target.closest('.chip');
      if(!chip) return;
      document.querySelectorAll('#occasionRow .chip').forEach(function(c){c.classList.remove('selected');});
      chip.classList.add('selected');
      state.occasion = chip.dataset.value;
      document.getElementById('err2a').style.display = 'none';
    });
  
    document.getElementById('paletteGrid').addEventListener('click', function(e){
      var card = e.target.closest('.swatch-card');
      if(!card) return;
      document.querySelectorAll('#paletteGrid .swatch-card').forEach(function(c){c.classList.remove('selected');});
      card.classList.add('selected');
      state.palette = card.dataset.value;
      document.getElementById('err2b').style.display = 'none';
    });
  
    document.getElementById('uploadBox').addEventListener('click', function(){
      document.getElementById('uploadInput').click();
    });
    document.getElementById('uploadInput').addEventListener('change', function(e){
      var f = e.target.files[0];
      if(f){
        state.fileName = f.name;
        document.getElementById('uploadFileName').textContent = 'Attached: ' + f.name;
      }
    });
  
    function showFieldError(id, show){
      var field = document.getElementById(id).closest('.field');
      field.classList.toggle('error', show);
    }
  
    function validateStep(n){
      var ok = true;
      if(n === 1){
        if(!state.base){ document.getElementById('err1').style.display = 'block'; ok = false; }
      }
      if(n === 2){
        if(!state.occasion){ document.getElementById('err2a').style.display = 'block'; ok = false; }
        if(!state.palette){ document.getElementById('err2b').style.display = 'block'; ok = false; }
      }
      if(n === 3){
        var size = document.getElementById('size').value.trim();
        var timeline = document.getElementById('timeline').value;
        var budget = document.getElementById('budget').value;
        showFieldError('size', !size); if(!size) ok = false;
        showFieldError('timeline', !timeline); if(!timeline) ok = false;
        showFieldError('budget', !budget); if(!budget) ok = false;
        if(ok){
          state.personalization = document.getElementById('personalization').value.trim();
          state.size = size; state.timeline = timeline; state.budget = budget;
        }
      }
      if(n === 4){
        var name = document.getElementById('fullName').value.trim();
        var email = document.getElementById('email').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var st = document.getElementById('shipState').value.trim();
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        showFieldError('fullName', !name); if(!name) ok = false;
        showFieldError('email', !emailOk); if(!emailOk) ok = false;
        showFieldError('phone', !phone); if(!phone) ok = false;
        showFieldError('shipState', !st); if(!st) ok = false;
        if(ok){ state.fullName = name; state.email = email; state.phone = phone; state.shipState = st; }
      }
      return ok;
    }
  
    function renderReview(){
      var rows = [
        ['Base item', state.base],
        ['Occasion', state.occasion],
        ['Palette', state.palette],
        ['Size', state.size],
        ['Timeline', state.timeline],
        ['Budget', state.budget]
      ];
      document.getElementById('reviewBox').innerHTML = rows.map(function(r){
        return '<div class="review-row"><span class="rk">' + r[0] + '</span><span class="rv">' + (r[1] || '—') + '</span></div>';
      }).join('');
    }
  
    document.querySelectorAll('[data-next]').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(!validateStep(current)) return;
        var next = Number(btn.dataset.next);
        if(next === 4) renderReview();
        setStep(next);
      });
    });
    document.querySelectorAll('[data-prev]').forEach(function(btn){
      btn.addEventListener('click', function(){ setStep(Number(btn.dataset.prev)); });
    });
  
    // ---- Submit to Netlify Forms -------------------------------------
    // Netlify intercepts a urlencoded POST to any path on the site when the
    // body carries a form-name matching a form it detected at deploy time.
    // The matching static form lives in index.html.
    function showConfirmation(){
      document.getElementById('wizard').style.display = 'none';
      document.getElementById('tracker').style.display = 'none';
      document.getElementById('confirmPanel').classList.add('active');
      window.scrollTo({top: document.querySelector('.page-hero').offsetTop, behavior:'smooth'});
    }

    document.getElementById('wizard').addEventListener('submit', function(e){
      e.preventDefault();
      if(!validateStep(4)) return;

      var submitBtn = document.querySelector('#wizard [type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending\u2026'; }

      var payload = {
        'form-name': 'custom-order',
        'bot-field': '',
        base: state.base || '',
        occasion: state.occasion || '',
        palette: state.palette || '',
        personalization: state.personalization || '',
        size: state.size || '',
        timeline: state.timeline || '',
        budget: state.budget || '',
        fullName: state.fullName || '',
        email: state.email || '',
        phone: state.phone || '',
        shipState: state.shipState || '',
        // Netlify Forms stores files only on multipart submissions. This sends
        // the filename so Dianna knows to ask for the photo by reply.
        referencePhoto: state.fileName ? (state.fileName + ' (ask customer to email this)') : 'none'
      };

      var body = Object.keys(payload).map(function(k){
        return encodeURIComponent(k) + '=' + encodeURIComponent(payload[k]);
      }).join('&');

      fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body
      }).then(function(res){
        if(!res.ok) throw new Error('Submission failed: ' + res.status);
        showConfirmation();
      }).catch(function(err){
        console.error(err);
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
        var errEl = document.getElementById('err4');
        if(errEl){
          errEl.textContent = "That didn't send. Check your connection and try again, or email designherinc@example.com directly.";
          errEl.style.display = 'block';
        }
      });
    });
  
    document.querySelectorAll('.faq-q').forEach(function(q){
      q.addEventListener('click', function(){
        var item = q.closest('.faq-item');
        var a = item.querySelector('.faq-a');
        var open = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function(i){
          i.classList.remove('open');
          i.querySelector('.faq-a').style.maxHeight = null;
        });
        if(!open){
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  })();
}