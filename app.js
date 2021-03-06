// Delgetstei ajillah controller
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expeseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var nodeListForeach = function(list, callback){
   for(var i=0; i < list.length; i++){
     callback(list[i], i);
   }
  };

  var formatMoney = function(too, type){
    too = '' + too;
    var x = too.split("").reverse().join("");
    
    var y = '';
    var count = 1;

    for(var i = 0; i < x.length; i++){
      y = y + x[i];
      if(count%3 === 0) y = y + ',';
      count ++;
    }

    var z = y.split("").reverse().join("");
    
    if(z[0] === ',') z = z.substring(1, z.length - 1);

    if(type === 'inc') z = '+ ' + z;
    else z = '- ' + z;
    return z;
  };

  return {
    changeType: function(){
     var fields = document.querySelectorAll(DOMstrings.inputType + ', ' + DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
     nodeListForeach(fields, function(el){
      el.classList.toggle('red-focus');
     })
     document.querySelector(DOMstrings.addBtn).classList.toggle('red');
    },

    displayDate: function(){
     var unuudur = new Date();

     document.querySelector(DOMstrings.dateLabel).textContent = unuudur.getFullYear() + " оны " + unuudur.getMonth() + ' сарын';
    },
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt( document.querySelector(DOMstrings.inputValue).value),
      };
    },

    displayPercentages: function(allPercentages){
     // Zarlagiin NodeList-g oloh <button>click me</button>
     var elements = document.querySelectorAll(DOMstrings.expensePercentageLabel);
     
     //elements.forEach, Element bolgonii huvid zarlagiin huviig massivaas avch shivj oruulah
     nodeListForeach(elements, function(el, index){
      el.textContent = allPercentages[index];
     });
    
    },  
    
    getDomStrings: function () {
      return DOMstrings;
    },
   clearFields: function(){
     var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
    // Convert List to Array
    var fieldsArr = Array.prototype.slice.call(fields);
    fieldsArr.forEach(function(el, index, array){
    el.value = "";
    });

    fieldsArr[0].focus();
    // for(var i=0; i < fieldsArr.length; i++){
    //   fieldsArr[i].value = "";
    // }
   },
   tusviigUzuuleh: function(tusuv){
   var type;
   if(tusuv.tusuv >= 0) type = "inc";
   else type = "exp";
   document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(tusuv.tusuv, type);
   document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(tusuv.totalInc, 'inc');
   document.querySelector(DOMstrings.expeseLabel).textContent = formatMoney(tusuv.totalExp, 'exp');
   if(tusuv.huvi !== 0){
   document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + "%";
   }
   else {
    document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
   }
   
   },
   
   deleteListItem: function(id){
    var el = document.getElementById(id);
    el.parentNode.removeChild(el);
   },

    addListItem: function (item, type){
    // Orlogo zarlagiin elementiig aguulsan html-iig beltgene
     var html, list;
     if(type === 'inc'){
        list = DOMstrings.incomeList;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
     } else {
      list = DOMstrings.expenseList;
      html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
     }
    // Ter html dotoroo orlogo zarlagiin utguudiig REPLACE ashiglaj oorchilj ogno
    html = html.replace('%id%', item.id);
    html = html.replace('$$DESCRIPTION$$', item.description);
    html = html.replace('$$VALUE$$', formatMoney(item.value, type));
    // Beltgesen HTML-ee DOM ruu hiij ugnu
    document.querySelector(list).insertAdjacentHTML('beforeend', html);
    }

  };
})();
// Sanhuutei ajillah controller
var financeController = (function() {
  // private data
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  // private data
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var calculateTotal = function(type){
  var sum = 0;
  data.items[type].forEach(function(el){
  sum = sum + el.value;
  });
  
  data.totals[type] = sum;
  }

  // private data
  var data = {
    items: {
      inc: [],
      exp: []
    },

    totals: {
      inc: 0,
      exp: 0
    },

    tusuv: 0,
    huvi: 0,

  };

  return {
    tusuvTootsooloh: function(){
    // Niit orlogiin niilberiig toottsoolno
    calculateTotal('inc');
    // Niit zarlagiin niilberiig toottsoolno
    calculateTotal('exp');
    // Tusviig shineer tootsoolno
    data.tusuv = data.totals.inc - data.totals.exp;
    // Orlogo zarlagiin huviig tootsoolno
    if(data.totals.inc > 0)
      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
    else data.huvi = 0;
    },

    calculatePercentages: function(){
    data.items.exp.forEach(function(el){
     el.calcPercentage(data.totals.inc);
    })
    },

    getPercentages: function(){ 
      var allPercentages = data.items.exp.map(function(el){
        return el.getPercentage();
      })
      return allPercentages;
    },

    tusviigAvah: function(){
    return {
    tusuv: data.tusuv,
    huvi: data.huvi,
    totalInc: data.totals.inc,
    totalExp: data.totals.exp
    }
    },
    
    deleteItem: function(type, id){
      var ids = data.items[type].map(function(el){
        return el.id;
      });
      var index = ids.indexOf(id);

      if(index !== -1){
        data.items[type].splice(index,1);
      }
    },

    addItem: function(type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },

    seeData: function() {
      return data;
    }
  };
})();
// Programmiin holbogch controller
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    // 1. Oruulah ogogdliig delgetsees olj avna.
    var input = uiController.getInput();
    if(input.description !== "" && input.value !== ""){
    // 2. Olj avsan ogogdluudee sanhuugiin controllert damjuulj tend hadgalana.
    var item =financeController.addItem(input.type, input.description, input.value);
    // 3. Olj avsan ogogdluudee web deeree tohiroh hesegt ni gargana.
    uiController.addListItem(item, input.type);
    uiController.clearFields();
    // Tusviig shineer tootsoolood delgetsend uzuulne.
    updateTusuv();
    }
  };

  var updateTusuv = function(){
    // 4. Tusviig tootsoolno.
    financeController.tusuvTootsooloh();
    // 5. Uldegdel.
    var tusuv = financeController.tusviigAvah();
    // 6. Tusuviin tootsoog delgetsend gargana.
    uiController.tusviigUzuuleh(tusuv);
    // 7. Elementuudiin huviig tootsoolno.
    financeController.calculatePercentages();
    // 8. Elementuudiin huviig huleej avna. 
    var allPercentages = financeController.getPercentages();
    // 9. Edgeer huviig delgetsend gargana.
    uiController.displayPercentages(allPercentages);
  };

  var setupEventListeners = function () {
    var DOM = uiController.getDomStrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.key === "Enter" || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.inputType).addEventListener('change', uiController.changeType);

    document.querySelector(DOM.containerDiv).addEventListener('click', function(event){
     var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
     console.log(id);
     // id dotroo ym aguulj baih buyu true bwal doodoh uildliig hiine, yu ch baihgu bol false bolno
     if(id){
      var arr = id.split('-');
      var type = arr[0];
      var itemId = parseInt(arr[1]);
      // 1. Sanhuugiin module-aas type, id ashiglaad usgtana.
      financeController.deleteItem(type, itemId);
      // 2. Delgets deerees ene elementiig ustgana.
      uiController.deleteListItem(id);
      // 3. Uldegdel tootsoog shinechilj haruulna.
      updateTusuv();
     }
   
    })
  };
  return {
    init: function () {
      console.log("Event listener connected...");
      uiController.displayDate();
      uiController.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      })
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();