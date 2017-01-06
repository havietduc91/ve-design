Sand.template = Sand.template || {};
Sand.template = {
    //TODO
    render: function (templ, data) {
        if (Hogan) {
            try {
                var hoganTemplate = Hogan.compile(templ);
                var html = hoganTemplate.render(data);
                return html;
            }
            catch (e) {
                Sand.utils.log(templ);
                Sand.utils.log(data);
                return '';
            }
        }
        //Mustache
    },
    /*
    convert an array so we can populate into a multi checkbox
    or a
    obj = [
        'a' => true, //checked
        'b' => false,
        'c' => false
    ]
    */
    array_to_mustache_options : function(obj)
    {
        var ret = [];
        for (var i in obj)
        {
            ret.push(
            {
                name : i,
                checked : obj[i]
            });
        }
        return ret;
    }

};

