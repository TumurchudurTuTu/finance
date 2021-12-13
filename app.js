// Delgetstei ajillah controller
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt( document.querySelector(DOMstrings.inputValue).value),
      };
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
    addListItem: function (item, type){
    // Orlogo zarlagiin elementiig aguulsan html-iig beltgene
     var html, list;
     if(type === 'inc'){
        list = DOMstrings.incomeList;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
     } else {
      list = DOMstrings.expenseList;
      html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
     }
    // Ter html dotoroo orlogo zarlagiin utguudiig REPLACE ashiglaj oorchilj ogno
    html = html.replace('%id%', item.id);
    html = html.replace('$$DESCRIPTION$$', item.description);
    html = html.replace('$$VALUE$$', item.value);
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
  };

  // private data
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
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
    data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    tusviigAvah: function(){
    return {
    tusuv: data.tusuv,
    huvi: data.huvi,
    totalInc: data.totals.inc,
    totalExp: data.totals.exp
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
    // 4. Tusviig tootsoolno.
    financeController.tusuvTootsooloh();
    // 5. Uldegdel.
    var tusuv = financeController.tusviigAvah();
    // 6. Tusuviin tootsoog delgetsend gargana.
    console.log(tusuv);
    }
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
  };
  return {
    init: function () {
      console.log("Event listener connected...");
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
