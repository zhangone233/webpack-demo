// import lodash from 'lodash';
// 只要导入。不管有没有用，webpack都会创建依赖图关系。把模块所有代码都打包进来。

import "./index.css";

function component2(): HTMLDivElement {
    // eslint-disable-next-line no-undef
    const element: HTMLDivElement = document.createElement("div");
    element.innerHTML = "<br /> 我是app.ts 11";
    element.classList.add("container");
    element.setAttribute("test", "1");
    element.setAttribute("test2", "2");


    return element;
}
document.body.appendChild(component2());

export function hello2(name) {
    console.log(`hello ${name}`);
}

// @ts-ignore
if(module && module.hot){
    // @ts-ignore
    module.hot.accept(); // 不刷新页面，热替换
}
