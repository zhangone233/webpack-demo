
import _ from "lodash";
function component() {
	// eslint-disable-next-line no-undef
	// console.log(_);
	// lodash，现在通过一个 script 引入
	const element = document.createElement("div");
	element.innerHTML = _.join(["hello", "webpack", "world", '3444'], "test");
    element.classList.add('container')
  
	return element;
}
document.body.appendChild(component()); ;

if(module && module.hot){
    module.hot.accept();
}