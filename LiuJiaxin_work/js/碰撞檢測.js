/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-02-29 11:16:55
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-02-29 17:27:32
 * @FilePath: \Js-2024-02-29（第二十九天）\js\碰撞檢測.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 初始化li列表並獲取長度
var oUl = $('.container ul');
var ulChlid = oUl.children;
var liLen = ulChlid.length;
// 初始化參數位置
var startPosition = {
  x: 0,
  y: 0,
  top: 0,
  left: 0
}

var arrPos = [];
var isDown = false;
var isMoving = false;

var  dragEventMap = {
  targetEle: null,
  collisionEle: null,
  tempNodeList: [],
  // 按下鼠標
  'mousedown' : function(e) {
    if (e.target.tagName.toLowerCase() === 'li') {
      // 更新開關
      isDown = true;
      // 目標對象設置為被點擊的li
      this.targetEle = e.target;
      startPosition.x = e.clientX;
      startPosition.y = e.clientY;
      startPosition.left = this.targetEle.offsetLeft;
      startPosition.top = this.targetEle.offsetTop;
      this.targetEle.classList.add('active')
      this.tempNodeList = getNodeList(ulChlid);
    }
  },
  // 鼠標移動
  'mousemove' : function(e) {
    // 如果檢測到鼠標按下了
    if(isDown) {
      // 用于存储发生碰撞的元素
      var collisionEleArr = [];
      // 偏移值計算
      var _x = e.clientX - startPosition.x;
      var _y = e.clientY - startPosition.y;
      // 更新li的位置，使之移動
      this.targetEle.style.left = startPosition.left + _x + 'px';
      this.targetEle.style.top = startPosition.top + _y + 'px';
      this.targetEle.pointer = {
        // 記錄鼠标指针在浏览器窗口内的水平坐标位置
        x : e.clientX,
        y : e.clientY
      }

      // 檢測如果是其他沒有被移動的元素
      if (!isMoving) {
        for (i = 0; i < this.tempNodeList.length; i++) {
          this.tempNodeList[i].classList.remove('collision');
          // 如果 該元素不是當前被移動的元素且被檢測到了碰撞，碰撞列表添加之
          if (this.tempNodeList[i] != this.targetEle && isInvolved(this.targetEle.pointer, this.tempNodeList[i])) {
            collisionEleArr.push(this.tempNodeList[i])
          }
        }

        // 如果有碰撞元素
        if (collisionEleArr.length !== 0) {
          // 拿到目標被碰撞元素，添加碰撞狀態
          this.collisionEle = getShortDistance(collisionEleArr, this.targetEle);
          this.collisionEle.classList.add('collision');
          // 元素互換準備
          if (this.collisionEle) {
            // 获取目标元素,和碰撞在tempNodeList数组中的索引位置
            var targetIdx = this.tempNodeList.indexOf(this.targetEle);
            var collisiondx = this.tempNodeList.indexOf(this.collisionEle);
            // 先從数组中移除目标元素
            this.tempNodeList.splice(targetIdx, 1);
            // 再從在 `collisionIdx` 索引位置处插入目标元素
            this.tempNodeList.splice(collisiondx, 0, this.targetEle);
            serializeEle(this.tempNodeList, this.targetEle);
          }
        }
      }
    }
  },
  'mouseup': function(e) {
    if (isDown){
      isDown = false;
      this.targetEle.classList.remove('active');
      serializeEle(this.tempNodeList, null);
    }
  }
}


// 開始激活
initPosition();

oUl.addEventListener('mousedown', drag, false);
document.addEventListener('mousemove', drag, false);
document.addEventListener('mouseup', drag, false);