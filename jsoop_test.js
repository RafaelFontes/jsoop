require('./jsoop');
require('./FrontController');

console.log((new FrontController({
    method: "GET",
    url : "/",
    type: "html"
}, null)).run());

console.log((new FrontController({
    method: "POST",
    url : "/",
    type: "json"
}, null)).run());