Sand.youtube = Sand.youtube || {};
Sand.youtube = {
    //TODO: This is by default Flash, should maybe change it to HTML5
    get_embed_code: function (vid, width, height) {
        // width = width ? width : 350;
        // height = height ? height : 197;
        width = 350;
        height = 197;
        str = '<div class="youtube-preview">' +
            '<div class="closex">' + '<a href="javascript:void(0);" data-sand-fake="1" data-sand-as="' + "remove_my_parent('.youtube-preview')" + '" class="btn btn-primary btn-sm">X</a></div>' +
            '<div class="youtube">' +
            '<iframe width="' + width + '" height="' + height + '"' +
            'src="https://www.youtube.com/embed/' + vid + '?autoplay=1">' +
            '</iframe>' +

            // '<object >'+
            // '<param name="movie" value="https://www.youtube.com/v/' + vid + '?version=3&f=videos"></param>'+
            // '<param name="allowFullScreen" value="true"></param>'+
            // '<param name="allowscriptaccess" value="always"></param>'+
            // '<embed src="https://www.youtube.com/v/'+vid+'?version=3&f=videos" type="application/x-shockwave-flash"' + 
            // 'width="100%" height="100%" allowscriptaccess="always" allowfullscreen="true"></embed>'+
            // '</object>'
            '</div></div>';
        return str;
    }
};

