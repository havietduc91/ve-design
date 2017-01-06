Sand.url = Sand.url || {};
Sand.url.history = [];
Sand.url.current_index = 1;

Sand.url.get_parameter = function (name, location) {
    location = location || window.location;
    var ret = decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location) || [, null])[1]
    );
    if (ret == 'null')
        return '';
    return ret;
};

Sand.url.goto_hashbang = function (snippet) {
    if (!snippet)
        snippet = '#!';

    var hash = window.location.hash;
    var href = window.location.href;
    if (snippet.indexOf('#') !== 0) {
        snippet = '#!' + snippet;
    } //else snippet == ''
    if (hash && hash.length > 0)
        href = href.replace(hash, '');

    //push snippet if previous url is not snippet
    if (Sand.url.history.length > 0) {
        var last_url = Sand.url.history[Sand.url.history.length - 1];
        if (last_url != snippet)
            Sand.url.history.push(snippet);
    }
    else //first time
        Sand.url.history.push(snippet);

    window.location.href = href + snippet;
    //TODO: push this url into history & handle all the links....
};

Sand.url.back = function () {
    if (Sand.url.history.length > 0) {
        Sand.url.history.pop();
    }
    var last_url;
    if (Sand.url.history.length > 0) {
        last_url = Sand.url.history[Sand.url.history.length - 1];
    }
    else {
        last_url = '';
    }
    Sand.url.goto_hashbang(last_url);
}

