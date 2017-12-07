var register = function(Handlebars) {
    // Specify helpers which are only registered on this instance.
    var helpers = {
       if_eq: function(a, b, opts) {
            if (a == b) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
       },
       inc: function(value, options){
            return parseInt(value) + 1;
        },

       to_string:function(content){
        return JSON.stringify(content);
       } 
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
};

module.exports.register = register;
module.exports.helpers = register(null);