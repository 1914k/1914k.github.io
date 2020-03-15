window.onload = function () {
  let one = "";
  let two = "";
  let arr = [];
  let oBtnItem = document.getElementsByClassName("btn-item");

// ************************计算规则处理  start******************************

  // 把加减乘除符号换成对应的 + - * %
  processOperaton = (className) => {
    switch(className) {
      case "division":
        return '/';
      case "multi":
        return '*';
      case "sub":
        return '-';
      case "inc":
        return '+';
      default: 
        break;
    }
  }

  //处理 % 后接数字的函数
  addMultiOperaton = (arr, i) => {
    if(i > 1) {
      if(arr[i-1].curClass == "percentage") {
        return "*" + arr[i].curInn;
      }
      return arr[i].curInn;
    }
    return arr[i].curInn;
  }

  // 处理 % 后直接接小数点的情况
  addMultiOperatonBeforePoint = (arr, i) => {
    if (arr[i-1] && arr[i-1].curClass == "percentage") {
      return  "*.";
    }
    return arr[i].curInn
  }
// ************************计算规则处理  end******************************

// ************************点击事件规则处理  start******************************
  // 点击加减乘除时
  clickCal = (curObj, i, last) => {
    if(arr.length === 0) {
      return 
    }
    
    curObj.curClassTwo = i.classList[2];
    if (arr[last].curClass === "cal") {
      arr.splice(last, 1, curObj);
      return
    }
    arr.push(curObj);
  }

  // 每次点击 one 的内容设置
  oneInner = () => {
    one = "";
      for( let i of arr) {
        one += i.curInn; 
      } 
  }

  // 使用 eval 时式子以运算符号结尾报错的处理
  calAfter = (curClass) => {
    try{
      let result = eval(calculate(arr));

      two = result ? result : "";

      if (curClass == "eq") {
        one = two;
        arr = [];
        arr.push({curClass: "num", curInn: one});
        two = ""
      }
     
      document.getElementById('one').innerHTML = one;
      document.getElementById('two').innerHTML = two;
    }catch(e){
      // e 是错误信息
      // console.log(e);
      
      document.getElementById('one').innerHTML = one;
      document.getElementById('two').innerHTML = two;
    }
  } 


// ************************点击事件规则处理  end******************************



  // 计算
  function calculate(arr) {
    let result = ''
    
    for(let i in arr) { 
      switch(arr[i].curClass) {
        case "cal":
          // 把加减乘除符号换成对应的 + - * %
          let ope = processOperaton(arr[i].curClassTwo);
          result += ope;
          break;
        case "percentage":
          result += "/100";
          break;
        case "num":
          // 处理 % 后直接接数字的情况
          let amo = addMultiOperaton(arr, i);
          result += amo;
          break;
        case "point":
          // 处理 % 后直接接小数点的情况
          let amobp = addMultiOperatonBeforePoint(arr, i);
          result += amobp;
          break;
        default:
          result += arr[i].curInn;
          break; 
      }
    }
    return result;
  }

  // 点击事件
  for (let i of oBtnItem) {
    i.onclick = function() {
      let curClass = this.classList[1];
      let curInn = this.innerHTML;
      let curObj = {
        curClass,
        curInn
      };
      let last = arr.length - 1;

      switch (curClass) {
        case "num":
          arr.push(curObj);
          break;
        case "box-cle":
          arr = [];
          break;
        case "box-del":
          arr.pop();
          break;
        case "cal":
          // 点击加减乘除时符号的处理
          clickCal(curObj, i, last);
          break;
        case "percentage":
          // % 在第一位会显示错误
          if (!arr[last]) {
            two = "错误";           
          }
          arr.push(curObj);
          break;
        case "point":
          // 小数点在最后一位点击小数点不会再增加小数点
          if (arr.length > 1 && arr[last].curClass === "point")
            break;
          arr.push(curObj);
          break;
        default:
          break;
      }
      // 点击时one内容的变化
      oneInner()
      // 运算符号结尾报错处理
      calAfter(curClass);
    }
  }
}
