require('./Controller');

/**
 * @class HomeController
 * @extends Controller
 * @constructor
 */
Class.create('HomeController::Controller',
{
    "\
    @Route /index;\
    @Method POST;\
    @RequestType json;\
    langAction":
        function ()
        {
            this.response = {"success": true, message: "Got here!"};
        },
    "\
    @Route /index;\
    @Method GET;\
    @RequestType html;\
    indexAction":
        function ()
        {
            this.response = "<h1>Got here!</h1>";
        }
});