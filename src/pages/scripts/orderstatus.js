// Page behaviour ported from the orderstatus prototype. Runs once on mount.
export default function init() {
  document.getElementById('toggleStatus').addEventListener('click', function(){
      document.getElementById('panelConfirmed').classList.toggle('active');
      document.getElementById('panelIssue').classList.toggle('active');
      window.scrollTo({top:0, behavior:'smooth'});
    });
}
