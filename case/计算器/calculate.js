window.onload = function () {
  let one = "";
  let two = "";
  let arr = [];
  let oBtnItem = document.getElementsByClassName("btn-item");

  // 计算规则

  // 计算加减乘除时
  changeSign = (className,result) => {
    console.log(className,result);
    switch(className) {
      case "division":
        result += '/';
        // division(result);
        break;
      case "multi":
        result += '*';
        break;
      case "sub":
        result += '-';
        break;
      case "inc":
        result += '+';
        break;
      default: 
        break;
    }
  }

  // 计算规则
  function calculate(arr) {
    let result = ''
    console.log(arr);
    
    for(let i in arr) { 
      switch(arr[i].curClass) {
        case "cal":
          switch(arr[i].curClassTwo) {
            case "division":
              result += '/';
              // division(result);
              break;
            case "multi":
              result += '*';
              break;
            case "sub":
              result += '-';
              break;
            case "inc":
              result += '+';
              break;
            default: 
              break;
          }
          // changeSign(arr[i].curClassTwo, result)
          break;
        case "percentage":
          result += "/100";
          break;
        case "num":
          if(i > 1) {
            if(arr[i-1].curClass == "percentage") {
              result += "*" + arr[i].curInn;
              break;
            }
            result += arr[i].curInn;
            break;
          }
          result += arr[i].curInn;
          break;
        case "point":
          if (arr[i-1] && arr[i-1].curClass == "percentage") {
            result += "*.";
            break;
          }
          console.log("这里");
          result += arr[i].curInn;
          break;
        default:
          result += arr[i].curInn;
          break; 
      }
    }
    console.log(result);
    return result;
  }
  // console.log(78/9* 5/100* 2.6);
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
        case "eq":
          console.log(arr);
          break;
        case "box-cle":
          arr = [];
          break;
        case "box-del":
          arr.pop();
          break;
        case "cal":
          curObj.curClassTwo = this.classList[2];
          if (arr[last].curClass === "cal") {
            arr.splice(last, 1, curObj);
            break;
          }
          arr.push(curObj);
          // console.log(arr);
          break;
        case "percentage":
          if (!arr[last]) {
            two = "错误";           
          }
          arr.push(curObj);
          break;
        case "point":
          if (arr.length > 1 && arr[last].curClass === "point")
            break;
          arr.push(curObj);
          break;
        default:
          break;
      }
      one = "";
      for( let i of arr) {
        one += i.curInn; 
      } 
      
      try{
        let result = eval(calculate(arr));
        
        two = result ? result : "";
        document.getElementById('one').innerHTML = one;
        document.getElementById('two').innerHTML = two;
      }catch(e){
        console.log(e);
        
        document.getElementById('one').innerHTML = one;
        document.getElementById('two').innerHTML = two;
      }
      
      // 
      
    }
  }
  
}