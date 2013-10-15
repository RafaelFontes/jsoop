var g  = (typeof(window) != 'undefined') ? window : GLOBAL;

/**
 * @param p Object source
 * @param n Attribute name
 * @param c Attribute descriptor
 */
function def(p,n,c)
{

    if (!n) return;
    try {
      Object.defineProperty(p,n,c);
    } catch(ex)
    {
      throw "Problem setting: " + JSON.stringify(p) + "-" + JSON.stringify(n) + "-" + JSON.stringify(c);
    }
}
/**
 * @param p Object source
 * @param c Object with multiple Attributes
 */
function defs(p,c)
{
    Object.defineProperties(p,c);
}

/**
 * @class Class
 * @constructor
 */
def(g, 'Class',{
    __proto__: Function.prototype,
    value : new Function,
    freeze: true
});

def(Class,
    'toString',
    { freeze: true, value : function(){ return 'abstract class Class() { [not native code] }' } }
);

defs(
    Class,
    {
        create:
        {
            /**
             * @function create
             * @methodOf Class
             * @public
             * @param {string} name
             * @param {Object} config
             */
            value : function Class$create(name, config)
            {
                var exts = name.split("::");
                name  = exts.shift().trim();


                if (g[name]) throw new TypeError('Class '+name+' already declared.');

                def(g, name,{
                    value : new Function('if (this.parent) { this.parent = new this.parent();  } if (this.init) { this.init.apply(this, arguments); }; '),
                    freeze: true
                });

                var strExt = '';
                var inheritance = {methods:{},fields:{}};

                exts.reverse().forEach(function(n){

                    var methods = g[n.trim()].getMethods();
                    for(var method in methods)
                    {
                        if (methods.hasOwnProperty(method))
                        {
                            inheritance.methods[method] = methods[method];
                            g[name].prototype[method] = methods[method];
                        }
                    }
                    var fields = g[n.trim()].getFields();
                    for(var field in fields)
                    {
                        if (fields.hasOwnProperty(field))
                        {
                            inheritance.fields[field] = fields[field];
                            g[name].prototype[field] = fields[field];
                        }
                    }
                });

                if (exts.length)
                {
                    strExt = ' extends '+ exts[0].trim() + ' ';
                    g[name].prototype.parent = g[exts[0]];
                    g[name].prototype.__proto__ = g[exts[0]].prototype;
                }


                def(g[name],
                    'toString',
                    { freeze: true, value : function(){ return 'public class '+name+strExt+'() { [not native code] }' } }
                );


                if (config) this.build(g[name], config, inheritance);
            }
        },

        build :
        {
            /**
             * @function build
             * @methodOf Class
             * @private
             */
            value : function Class$build(obj, config, inheritance)
            {
                var methods = inheritance.methods;
                var fields = inheritance.fields;

                for(var field in config)
                {
                    var annotations = {};
                    if (!config.hasOwnProperty(field)) continue;
                    if (field == 'constant' ||
                        field == 'static')
                    {
                        // @TODO : build static and constant
                        return;
                    }

                    var value = config[field];

                    var arrAnnotations = field.split(";");
                    //@TODO : build annotations
                    /*
                     * Annotation Syntax :
                     * Class.create('name', {
                     *     '@annotation1(param1=value,param2=value);\
                     *      @annotation2; \
                     *      attribute|method' : value|function
                     * });
                     */

                    field = arrAnnotations.pop().trim().replace(/\\s+/g,"");

                    arrAnnotations.forEach(function(a)
                    {
                        var aargs = a.trim().substr(1).split(" ");
                        annotations[aargs.shift()] = aargs.join(" ");
                    });

                    var writable = !(typeof(value)=='function');

                    if (value !== null)
                    {
                        def(value, 'annotations',
                        {
                            freeze: true,
                            value : annotations
                        });
                    }

                    def(obj.prototype, field,
                    {
                        writable : writable,
                        value: value
                    });

                    if (!writable)
                    {
                        def(methods, field,{
                            freeze : true,
                            enumerable : true,
                            value : obj.prototype[field]
                        })
                    }
                    else
                    {
                        def(fields, field,{
                            freeze : true,
                            enumerable : true,
                            value : obj.prototype[field]
                        });
                    }
                }

                def(obj,
                'getMethods',
                {
                    freeze : true,
                    value : function getMethods()
                    {
                        return methods;
                    }
                });

                def(obj.prototype,
                'getMethods',
                {
                    freeze : true,
                    value : function getMethods()
                    {
                        return methods;
                    }
                });

                def(obj,
                'getFields',
                {
                    freeze : true,
                    value : function getFields()
                    {
                        return fields;
                    }
                });

                def(obj.prototype,
                'getFields',
                {
                    freeze : true,
                    value : function getFields()
                    {
                        return fields;
                    }
                });
            }
        }
    }

);