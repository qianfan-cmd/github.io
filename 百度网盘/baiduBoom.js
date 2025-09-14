document.addEventListener('DOMContentLoaded',() => {

    console.log("脚本已加载，开始初始化...");
    
 
    const getElement = (id) => {
        const el = document.getElementById(id);
        if (!el) console.error(`元素 #${id} 未找到`);
        return el;
    };

    const elements = {
        baidu: getElement('baidu'),
        fragments: getElement('fragments'),
        life: getElement('Life'),
        reLife: getElement('reLife'),
        boom: document.querySelector('.boomImg'),
        btn: getElement('actionBtn')
    };

    // 2. 检查关键元素
    if (!elements.fragments || !elements.boom) {
        console.error("关键元素缺失，请检查HTML结构");
        return;
    }

    // 3. 碎片参数
    const GRID_SIZE = 10;
    const CELL_SIZE = 300 / GRID_SIZE;
    let isAlive = true;

    // 4. 创建碎片（带调试信息）
    const createFragments = () => {
        console.log("创建碎片...");
        elements.fragments.innerHTML = '';
        
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const dot = document.createElement('div');
                dot.className = 'fragment';
                dot.style.cssText = `
                    position: absolute;
                    width: ${CELL_SIZE}px;
                    height: ${CELL_SIZE}px;
                    background-image: url(${elements.baidu.src});
                    background-position: -${col * CELL_SIZE}px -${row * CELL_SIZE}px;
                    background-size: 300px 300px;
                    left: ${col * CELL_SIZE}px;
                    top: ${row * CELL_SIZE}px;
                    opacity: 1;
                    z-index: 2;
                    transition: all 0.5s ease-out;
                `;
                elements.fragments.appendChild(dot);
            }
        }
        console.log(`已创建 ${GRID_SIZE*GRID_SIZE} 个碎片`);
    };

    // 5. 粉碎动画（与爆炸完全同步）
    const breakAnimation = () => {
        console.log("执行粉碎动画...");
        // 重置所有碎片位置（
        document.querySelectorAll('.fragment').forEach(frag => {
            frag.style.transform = 'none';
        });
        
        // 使用requestAnimationFrame确保同步
        requestAnimationFrame(() => {
            anime({
                targets: '.fragment',
                translateX: () => anime.random(-250, 250),
                translateY: () => anime.random(-250, 250),
                rotate: () => anime.random(-360, 360),
                scale: () => anime.random(0.2, 0.8),
                opacity: 0,
                duration: 1500,
                easing: 'easeInQuad',
                delay: anime.stagger(15, {grid: [GRID_SIZE, GRID_SIZE], from: 'center'})
            });
        });
    };

 // 6. 复原动画（强制显示碎片拼合过程）
const restoreAnimation = () => {
    console.log("执行复原动画...");
    
    // 1. 确保碎片容器可见，且原图隐藏（关键：动画期间始终显示碎片）
    elements.baidu.style.display = 'none'; 
    elements.fragments.style.display = 'block';
    
    // 2. 先将所有碎片随机分散
    const fragments = document.querySelectorAll('.fragment');
    fragments.forEach(frag => {
        const randomX = anime.random(-200, 200);
        const randomY = anime.random(-200, 200);
        const randomRotate = anime.random(-180, 180);
        // 立即应用分散状态（无过渡，确保用户看到碎片散开）
        frag.style.transition = 'none';
        frag.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;////用于控制元素的几何变换（如平移、旋转、缩放等）
        frag.style.opacity = '0.5';
    });

    // 3. 强制重绘后，再执行飞回动画（确保用户看到碎片从分散到拼合的完整过程）
    requestAnimationFrame(() => {
        // 4. 执行飞回拼合动画（完全可见的过程）
        anime({
            targets: '.fragment',
            translateX: 0,      
            translateY: 0,       
            rotate: 0,           
            opacity: 1,          
            duration: 1000,     
            easing: 'linear', 
            delay: anime.stagger(15), 
            complete: () => {
                // 5. 动画完成后！！！延迟切换到原图（给用户100ms看清拼合结果）
                setTimeout(() => {
                    elements.baidu.style.display = 'block'; // 显示原图
                    elements.fragments.style.display = 'none'; // 隐藏碎片容器
                }, 100); 
            }
        });
    });
};

// 7. 主控制函数（只修改复活流程的时序）
const toggleEffect = () => {
    if (isAlive) {
        console.group("毁灭流程开始");
        elements.baidu.style.display = 'none';
        createFragments();
        elements.fragments.style.display = 'block';
        elements.boom.style.display = 'block';
        breakAnimation();
        elements.btn.style.display = 'none';
        setTimeout(() => {
            elements.boom.style.display = 'none';
            elements.life.style.display = 'block';
            elements.btn.textContent = "一键复活";
            elements.btn.style.backgroundColor = "rgb(77, 222, 77)";
            elements.btn.style.display = "block";
            isAlive = false;
            console.groupEnd();
        }, 2000);
        
    } else {
        console.group("复活流程开始");

        elements.reLife.style.display = 'block';
        elements.btn.style.display = 'none';
        
        // 确保碎片存在
        if (!document.querySelector('.fragment')) {
            createFragments(); // 重建碎片
        }
        
        setTimeout(() => {
            elements.life.style.display = 'none';
            elements.reLife.style.display = 'none'; // 隐藏动图，露出碎片容器
            restoreAnimation(); // 执行修复后的复活动画
            
            setTimeout(() => {
                elements.btn.textContent = "一键毁灭";
                elements.btn.style.backgroundColor = "blue";
                elements.btn.style.display = "block";
                isAlive = true;
                console.groupEnd();
            }, 1100); 
        }, 2500); 
    }
};


elements.btn.addEventListener('click', () => {
    toggleEffect(); 
});
})
