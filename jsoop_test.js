require('jsoop');

/**
 * @class Controller
 * @constructor
 */
Class.create('Controller',{
    url : null,
    init : function(url)
    {
        this.url = url;
    },
    getUrl : function()
    {
        return this.url;
    }
});

/**
 * @class HomeController
 * @constructor
 */
Class.create('HomeController::Controller', {

});

/**
 * @class LoginController
 * @constructor
 */
Class.create('LoginController::Controller', {
    // override
    getUrl : function()
    {
        return "Login URL : " + this.url;
    }
});

var hc = new HomeController('/home.html');
var lc = new LoginController('/login.html');

console.log(hc.getUrl());
console.log(lc.getUrl());
console.log(lc instanceof HomeController);
console.log(lc instanceof LoginController);
console.log(lc instanceof Controller);