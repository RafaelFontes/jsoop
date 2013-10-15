/**
 * @class Controller
 * @constructor
 */
Class.create('Controller',
{
    request : null,
    response : null,
    init : function(request, response)
    {
        this.request = request;
        this.response = response;
    }
});