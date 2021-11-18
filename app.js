// Delgetstei ajillah controller 
var uiController = (function(){
  
})();
// Sanhuutei ajillah controller 
var financeController = (function(){
    
})();
// Programmiin holbogch controller
var appController = (function(uiController, financeController){
var ctrlAddItem = function(){
    // 1. Oruulah ogogdliig delgetsees olj avna.
    console.log('hha');
    // 2. Olj avsan ogogdluudee sanhuugiin controllert damjuulj tend hadgalana.

    // 3. Olj avsan ogogdluudee web deeree tohiroh hesegt ni gargana.

    // 4. Tusviig tootsoolno.

    // 5. Etssiin uldegdel, tootsoog delgetsend gargana.
}
document.querySelector('.add__btn').addEventListener('click', function(){
    ctrlAddItem();
})
document.addEventListener('keypress', function(event){
    // console.log(event);
    if (event.key === 'Enter' || event.which === 13){
        ctrlAddItem();
    }
    
    
})


})(uiController, financeController);
