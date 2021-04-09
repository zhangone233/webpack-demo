// import lodash from 'lodash';
// 只要导入。不管有没有用，webpack都会创建依赖图关系。把模块所有代码都打包进来。

function component() {
    // eslint-disable-next-line no-undef
    const element = document.createElement("div");
    element.innerHTML = "<br /> 我是main.js 222";

    return element;
}
document.body.appendChild(component());

export function hello(name) {
    console.log(`hello ${name}`);
}


if(module && module.hot){
    module.hot.accept();
}
