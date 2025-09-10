//拿到网盘图片
const start = document.getElementsByClassName('imgSize')[0];
const alive = document.getElementById('reLife');
const ifAlive = document.getElementById('Life');
//拿到爆炸特效
const boom = document.getElementsByClassName('boomImg')[0];
if(!start||!boom){
   console.error('抓取失败');
}
//拿到按钮
const btn = document.querySelector('button'); 
let isAlive = true;
function toggleState() {
    if (isAlive) {
        // 毁灭流程
        console.log('毁灭');
        start.style.display = 'none';
        boom.style.display = 'block';
        btn.style.display = 'none';
        
        setTimeout(() => {
            boom.style.display = 'none';
            ifAlive.style.display = 'block';
            btn.innerHTML = "一键复活";
            btn.style.backgroundColor = "rgb(77, 222, 77)";
            btn.style.display = "block";
            isAlive = false; // 更新状态
        }, 3000);
    } else {
        // 复活流程
        console.log('复活');
        alive.style.display = 'block';
        setTimeout(()=>{
        start.style.display = 'block';
        btn.innerHTML = "一键毁灭";
        alive.style.display = 'none';
        ifAlive.style.display = 'none';
        btn.style.backgroundColor = "blue";
        isAlive = true; // 更新状态
        },2500);

    }
}

btn.addEventListener('click', toggleState);
