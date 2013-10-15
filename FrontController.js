require('./HomeController');

/**
 * @class FrontController
 * @constructor
 */
Class.create("FrontController",
{
    method     : null,
    controller : null,
    /**
     * @param request
     * @param response
     */
    init :  function(request, response)
    {
        var self = this;
        switch (request.url)
        {
            case "" :
            case " ":
            case "/":
            case "/home":
            case "/index":
                request.url = "/index";
                this.controller = new HomeController(request, response);
                break;
        }

        var methods = this.controller.getMethods();

        for(var name in methods)
        {
            var method        = methods[name];
            var route         = method.annotations.Route;
            var requestMethod = method.annotations.Method;
            var requestType   = method.annotations.RequestType;

            if (request.url    == route &&
                request.method == requestMethod &&
                request.type   == requestType)
            {
                this.method = name;
                break;
            }
        }

    },

    run : function()
    {
        if (this.method)
        {
            this.controller[this.method]();
            return this.controller.response;
        }
        return null;
    }
});