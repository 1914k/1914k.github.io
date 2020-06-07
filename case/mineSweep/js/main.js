new Vue({
  el: "#app",
  data(){
    return {
      levels: [
        // text:难度名称, value: 行格子数,列格子数,雷数
        {text: '简单', id: 0, value: [10, 10, 12]},
        {text: '一般', id: 1, value: [20, 20, 80]},
        {text: '困难', id: 2, value: [20, 20, 100]},
        {text: '自定义', id: 3, value: [5, 5, 2]}
      ],
      rows: 0, //行
      cols: 0, //列
      mineMap: [], //雷的地图
      time: 0, //时间
      timer: null, //计时器
      mineArr: [], //储存地雷的坐标数
      mineNum: 0,  //地雷数量
      currentLevel: {}, //当前难度
      isOver: false, //是否结束
      markArr: [], //标记的索引数组
      total: 0, //剩余格子总数
      win: false      
    }
  },
  created() {
      this.init()
  },
  computed: {
    currentLevelValue () {
      return this.currentLevel.value;
    }
  },
  watch: {
    currentLevelValue(newVal) {
        this.currentLevel.value = newVal;
        this.modeClick(this.currentLevel.id);
    }
  },
  methods: {
    // 初始化
    init(even){
        this.time = 0;
        this.timer = null;
        this.isOver = false;
        this.mineArr = [];
        this.win = false;
        this.markArr = [];
        this.currentLevel = even || this.levels[1];
        this.rows = this.currentLevel.value[0];
        this.cols = this.currentLevel.value[1];
        this.mineNum = this.currentLevel.value[2];
        this.total = this.cols * this.rows;
        this.createMap(this.rows, this.cols, this.mineNum);
    },
    //重置
    reset(even) {
      clearInterval(this.timer);
      this.init(even)
    },
     // 选择模式
     modeClick(index) {
      clearInterval(this.timer);
      let level = this.levels[index];
      this.init(level);
    },
    // 生成二维数组
    make2DArray(rows,cols){
      let arr = new Array(rows);
      for(let i = 0; i < rows; i ++){
          arr[i] = new Array(cols);
      }
      return arr;
    },
    // 生成 mineMap
    createMap(rows,cols,mineNum){
        this.notRpeat(rows,cols,mineNum)
        this.mineMap = this.make2DArray(rows,cols);
        let _this = this.mineMap;
        let index = 0;
        // 给每个小格子添加属性
        for(let x = 0; x < rows; x++) {
          for(let y = 0; y < cols; y++) {
            _this[x][y] = {};
            Vue.set(_this[x][y],'mine',0);
            Vue.set(_this[x][y],'index',index);
            Vue.set(_this[x][y],'x',x);
            Vue.set(_this[x][y],'y',y);
            Vue.set(_this[x][y],'isCover',true);
            Vue.set(_this[x][y],'isMark',false);
            if(this.mineArr.indexOf(index) !== -1) {
              Vue.set(_this[x][y],'mine',1);
            }
            index++;
          }
        }
        this.addNum(rows,cols);
        // this.$forceUpdate();
    },
    // 生成随机的索引
    random(rows,cols) {
      let index = parseInt(Math.random()*rows*cols);
      return index
    },
    //避免生成重复雷点
    notRpeat(rows,cols,mineNum){
      for(let i = 0; i < mineNum; i++){
        let index = this.random(rows,cols);
        if(this.mineArr.indexOf(index) == -1){
          this.mineArr.push(index);
        }else {
          i--;
        }
      }
      this.mineArr.sort()
    }, 
    //得到小格子周围的有效格子
    validGrid(x,y,rows,cols){
        let arr = [
          [x-1,y-1],
          [x-1,y],
          [x-1,y+1],
          [x,y-1],
          [x,y+1],
          [x+1,y-1],
          [x+1,y],
          [x+1,y+1],
        ]
        function select(arr){
          return (arr[0] > -1 && arr[1] > -1 && arr[0] < rows && arr[1] < cols);
        }
        var newArr = arr.filter(select);
        return newArr;
    },
    // 判断对应的有效格子里有几个雷
    countLei(arr){
        let num = 0;
        arr.forEach(e => {
          num += this.mineMap[e[0]][e[1]].mine;
        });
        return num;
    },
    // 计时器
    timeCount(){
        this.timer = setInterval(() => {
          this.time++;
        },1000)
    },
    // 左键点击
    leftGridClick(i){
      if(this.isOver) return; //结束不点击
      if(!this.timer) {       //没开启计时则开启计时
        this.timeCount();
      }
      if(i.isCover === false) return; //
      if(i.isMark === true) return;
      let _this = this.mineMap[i.x][i.y];
      this.$set(_this,'isCover',false);
      // 点击到雷结束游戏
      if(i.mine === 1) {
        this.over(i);
      }else { //不是雷剩余格子数减一
        this.total--;
      }
      // 点到零 扩散
      if(i.mineNum === 0)
       this.clickZero(i);
      if(this.total === this.currentLevel.value[2]) this.victory();
      this.$forceUpdate();
    },
    // 右键点击
    rightClick(i){
      if(this.isOver) return;
      if(this.mineNum === 0) {
        if(!i.isMark) return;
      }
      this.markgird(i);
      
      if(this.mineArr.join('') == this.markArr.join(''))
        this.victory()
      this.$forceUpdate();
    },
    // 为小格子添加周围 雷 数属性
    addNum(rows,cols) {
        for(let x = 0; x < rows; x++){
          for(let y = 0; y < cols; y++) {
            let valGrid = this.validGrid(x,y,rows,cols);
            let num = this.countLei(valGrid);
            this.mineMap[x][y].mineNum = num;
          }
        }
    },
    //标记格子
    markgird(i) {
      console.log(i);
      i.isMark = !i.isMark;
      let index = this.markArr.indexOf(i.index);
      if(index !== -1){
        this.markArr.splice(index,1);
        this.mineNum++;
      }else {
        this.markArr.push(i.index);
        this.markArr.sort()
        this.mineNum--;
      }
    },
    //显示所有雷
    showMines(arr){
      this.mineMap.forEach(e => {
        e.forEach(e => {
          if(e.mine === 1 && e.isMark === false) {
            e.isCover = false;
          }
        })
      })
    },
    // 点击到雷游戏结束
    over(i) {
      clearInterval(this.timer);
      this.isOver = true;
      i.mine = 2;
      this.showMines();
    },
    // 点击到 0
    clickZero(i) { 
      let arr = this.validGrid(i.x,i.y,this.rows,this.cols);
      arr.forEach(e => {
        let item = this.mineMap[e[0]][e[1]];
        this.leftGridClick(item);
      });
    },
    // 游戏胜利方式一（所有不是雷的格子都暴露）
    victory(){
      clearInterval(this.timer);
      this.showMines();
      this.isOver = true;
      alert("赢了！");
      this.win = true;
    }
  }
})