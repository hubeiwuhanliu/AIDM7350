// 獲取元素簡易函數
function $(ele) {
  return document.querySelector(ele);
}

function $$(ele) {
  return document.querySelectorAll(ele);
}

// 獲取節點列表，将节点列表转换为节点数组
function getNodeList(nodeList) {
  var nodeArr = [];
  for (i=0, len=nodeList.length; i<len; i++) {
    nodeArr[i] = nodeList[i];
  }
  return nodeArr;
}

// 獲取對象坐標位置
function getPosition(element) {
  var pos = {
    left : 0,
    top : 0
  }
  // 只要檢測到對象有上級就一直纍加
  while (element.offsetParent) {
    pos.left += element.offsetLeft;
    pos.top += element.offsetTop;
    element = element.offsetParent;
  } 
  // 返回位置對象
  return pos
}


// 指針碰撞檢測
// 接受pos对象，包含了指针的 x 和 y 坐标； 接受ele元素对象，表示需要进行碰撞检测的元素
function isInvolved(pos, ele) {
  // 獲取左边界 `L1`、上边界 `T1`、右边界 `R1` 和下边界 `B1`
  var L1 = getPosition(ele).left;
  var T1 = getPosition(ele).top;
  // offsetWidth 是一个只读属性，用于获取元素的可见宽度
  var R1 = L1 + ele.offsetWidth;
  var B1 = T1 + ele.offsetHeight;

  // 如果指针坐标位于元素的边界内部，则返回 `true` 表示发生了碰撞
  if (pos.x > L1 && pos.x < R1 && pos.y > T1 && pos.y < B1) {
    return true;
  }
  return false;
}


// 計算距離最近的元素
// 两个参数：`arr` 是一个元素数组，`ele` 是當前選中元素
function getShortDistance(arr, ele) {
  if (arr.length === 0) {
    return ele;
  }
  // 用于存储每个元素与目标元素的距离信息
  var resultArr = [];

  // 遍歷被碰撞元素列表
  arr.forEach(function (item, idx, arr) {
    var horizontalDistance = item.offsetLeft - ele.offsetLeft;
    var verticalDistance = item.offsetTop - ele.offsetTop;
    resultArr.push({
      element: item,
      // 三角函數求距離
      distance: Math.sqrt(horizontalDistance * horizontalDistance + verticalDistance * verticalDistance)
    })
  });

  // 迭代更新返回最短路徑的對象
  return resultArr.reduce(function(acc, item, idx, arr){
    // 从数组的第一个元素开始迭代,`acc` 的初始值是 `resultArr[0]`
    if (acc.distance >= item.distance) {
      acc = item;
    }
    return acc
  }).element;
}


// 序列化移动
function serializeEle(tempList, target) {
  // 将全局变量 `isMoving` 的值设置为 `true`，表示元素正在移动中
  isMoving = true;
  arrPos.forEach(function(item, idx, arr) {
    if (target !== tempList[idx]) {
      setTimeout(function() {
        tempList[idx].style.left = item[0] + 'px';
        tempList[idx].style.top = item[1] + 'px';
      }, 0);
    }
  });
  setTimeout(function() {
    isMoving = false;
  }, 200);
}


// 初始化絕對定位函数
function initPosition() {
  for (i=0; i<liLen; i++) {
    (function(i) {
      // 就记录了每个元素在页面中的初始位置
      arrPos.push([ulChlid[i].offsetLeft, ulChlid[i].offsetTop]);
      setTimeout(function() {
        ulChlid[i].style.position = 'absolute';
        ulChlid[i].style.left = arrPos[i][0] + 'px';
        ulChlid[i].style.top= arrPos[i][1] + 'px';
      }, 0);
    })(i);
  }
}


function drag(e) {
  // 如果事件被觸發
  dragEventMap[e.type] && dragEventMap[e.type](e);
}



/**
 * @description: 函数的功效
 * @param {Object} element 需要监听的DOM对象
 * @param {String} type 事件类型 click mouseenter
 * @param {Function} fn 监听绑定的回调函数
 * @param {Boolean} capture true 捕获阶段监听 false 冒泡阶段监听 
 * @return {JSON} "remove":Function 返回一个用于解除监听的函数
 * @Date: 2024-02-29 22:45:25
 */
function eventListener (element, type, fn, capture) {
  capture = capture || false; //处理capture的默认值为 false
  if (element.addEventListener) {
    //标准浏览器写法
    element.addEventListener(type, fn, capture);
  } else {
    //IE兼容写法
    element.attachEvent("on" + type, fn);
  }

  return {
    'remove': function () {
      if (element.removeEventListener) {
        element.removeEventListener(type, fn, false);
      } else {
        element.detachEvent("on" + type, fn);
      }
    }
  }
}