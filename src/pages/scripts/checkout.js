// Page behaviour ported from the checkout prototype. Runs once on mount.
export default function init() {
  (function(){
    var requiredFields = ['email','fullName','address1','city','state','zip','phone'];
  
    function validate(){
      var ok = true;
      requiredFields.forEach(function(id){
        var input = document.getElementById(id);
        var field = input.closest('.field');
        var val = input.value.trim();
        var valid = val.length > 0;
        if(id === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        field.classList.toggle('error', !valid);
        if(!valid) ok = false;
      });
      return ok;
    }
  
    document.getElementById('checkoutForm').addEventListener('submit', function(e){
      e.preventDefault();
      if(!validate()){
        document.querySelector('.field.error').scrollIntoView({behavior:'smooth', block:'center'});
        return;
      }
      var btn = document.getElementById('placeOrderBtn');
      btn.classList.add('loading');
      btn.setAttribute('disabled', 'true');
      // Prototype-only delay to preview the loading state.
      // In production this fires on stripe.confirmCardPayment() resolving.
      setTimeout(function(){
        window.location.href = 'order-status.html';
      }, 1100);
    });
  })();
}
