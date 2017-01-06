Sand.string = Sand.string || {};

RegExp.quote = function (str) {
    return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

String.prototype.replaceAll = function (str, replace) {
    reg = new RegExp(RegExp.quote(str), 'g');
    return this.replace(reg, replace);
};
String.prototype.cleanUrl = function () {
    return this.replace(/([^:]\/)\/+/g, "$1");
};
$(document).ready(function () {
    Sand.string = $.extend(Sand.string, {
        //return boolean
        match_unaccent_vietnamese: function(str, term, convert)
        {
            if (convert)
            {
                str = Sand.string.unaccent_vietnamese(str);
                term = Sand.string.unaccent_vietnamese(term);
            }

            term = term.toLowerCase();
            str = str.toLowerCase();
            term = Sand.string.multiple_spaces_to_one(term);
            var terms = term.split(' ');
            for (i in terms)
            {
                if (str.indexOf(terms[i]) === -1)
                {
                    
                    console.log(' failed ' + str + ' ' + term);
                    return false;
                }
            }
            return true;
        },
        capitalise_first_letter: function (s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        // this Is hello => This Is Hello . Like a news article's title
        capitalise_title_case: function (s) {
            var str = s.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

            //Upper case for unicode string
            var capitalisedStr = '';
            var arrStr = str.split(' ');
            $.each(arrStr, function (intIndex, objValue) {
                capitalisedStr = capitalisedStr + ' ' + Sand.string.uppercase_vietnamese(objValue.charAt(0)) + objValue.substr(1).toLowerCase();
            });

            return capitalisedStr.trim();
        },
        multiple_spaces_to_one: function (s) {
            return $.trim(s.replace(/\s{2,}/g, ' '));
        },
        replace_all_spaces: function (s) {
            return s.replace(/\s/g, '');
        },
        //trim last & beginning br & white spaces
        //trimming beginning & first \n, <br/> or <br> or <br /> or <br >
        trim_br: function (t) {
            var b = $.trim(t);
            //now replace the last <br/>
            regex1 = /<br(\s)?(\/)?>$/g;
            // and the first <br/>
            regex2 = /^<br(\s)?(\/)?>/g;

            //regex3 =      /\\n/g ;

            while (b.match(regex1) || b.match(regex2)) {
                b = b.replace(regex1, '');
                b = b.replace(regex2, '');
                //b = b.replace(regex3,'');
            }
            b = b.replaceAll('\n', '');
            b = Sand.string.multiple_spaces_to_one(b);
            return b;
        },
        uppercase_vietnamese: function (str) {
            var trans = {
                'á': 'Á', 'à': 'À', 'ả': 'Ả', 'ã': 'Ã', 'ạ': 'Ạ',
                'ă': 'Ă', 'ắ': 'Ắ', 'ằ': 'Ằ', 'ẳ': 'Ẳ', 'ẵ': 'Ẵ', 'ặ': 'Ặ',
                'â': 'Â', 'ấ': 'Ấ', 'ầ': 'Ầ', 'ẩ': 'Ẩ', 'ẫ': 'Ẫ', 'ậ': 'Ậ',

                'đ': 'Đ',

                'é': 'É', 'è': 'È', 'ẻ': 'Ẻ', 'ẽ': 'Ẽ', 'ẹ': 'Ẹ',
                'ê': 'Ê', 'ế': 'Ế', 'ề': 'Ề', 'ể': 'Ể', 'ễ': 'Ễ', 'ệ': 'Ệ',

                'í': 'I', 'ì': 'Ì', 'ỉ': 'Ỉ', 'ĩ': 'Ĩ', 'ị': 'Ị',

                'ó': 'Ó', 'ò': 'Ò', 'ỏ': 'Ỏ', 'õ': 'Õ', 'ọ': 'Ọ',
                'ô': 'Ô', 'ố': 'Ố', 'ồ': 'Ồ', 'ổ': 'Ổ', 'ỗ': 'Ỗ', 'ộ': 'Ộ',
                'ơ': 'Ơ', 'ớ': 'Ớ', 'ờ': 'Ờ', 'ở': 'Ở', 'ỡ': 'Ỡ', 'ợ': 'Ợ',

                'ú': 'Ú', 'ù': 'Ù', 'ủ': 'Ủ', 'ũ': 'Ũ', 'ụ': 'Ụ',
                'ư': 'Ư', 'ứ': 'Ứ', 'ừ': 'Ừ', 'ử': 'Ử', 'ữ': 'Ữ', 'ự': 'Ự',

                'ý': 'Y', 'ỳ': 'Ỳ', 'ỷ': 'Ỷ', 'ỹ': 'Ỹ', 'ỵ': 'Ỵ'
            };

            for (i in trans)
                str = str.replace(i, trans[i]);

            return str;
        },
        unaccent_vietnamese: function (str) {
            var trans = {
                'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
                'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
                'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
                'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
                'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
                'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
                'đ': 'd', 'Đ': 'D',
                'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
                'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
                'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
                'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
                'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
                'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
                'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
                'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
                'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
                'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
                'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
                'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
                'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u', 'ủ': 'u',
                'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
                'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
                'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
                'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
                'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y'
            };

            for (i in trans)
                str = str.replace(i, trans[i]);
            return str;
        },
        //courtesy: lasnv http://lasnv.net/foro/839/Javascript_parsear_URL_de_YouTube
        //http://stackoverflow.com/a/8260383/513116
        getYoutubeIdFromUrl: function (url) {
            if (url.indexOf('/') == -1)//url itself is a yt id
                return url;
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[7].length == 11) {
                var youtube_id = match[7];
                return youtube_id;
            }
            else {
                return '';
            }
        },

        strip_html_tag: function (html) {
            var div = document.createElement("div");
            div.innerHTML = html;
            text = div.textContent || div.innerText || "";
            return text;
        },
        //http://stackoverflow.com/a/873856
        generateUUID: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },

        rte_text_to_array: function (text_content, sep) {
            var ret = [];
            var tmp = [];


            sep = sep || '---';
            if (sep == 'newline') // either each new line wrapped in <div> , <p> or <br/> or \n 
            {
                //create a jquery element
                $("body").append("<div id='temp-123'>" + text_content + "</div>");
                var $a = $("#temp-123");
                rte_newline = false;

                if ($a.find("li").length > 0) {
                    rte_newline = "li";
                }
                else if ($a.find("div").length > 0) {
                    rte_newline = "div";
                }
                else if ($a.find("p").length > 0) {
                    rte_newline = "p";
                }

                if (rte_newline) {
                    $a.find(rte_newline).each(function (i, e) {
                        tmp.push($(this).html());
                    });
                }
                else //new line = <br/> or newline
                {

                }
                //remove this out of DOME
                $a.remove();
            }
            else if (sep == 'space') {
                text_content = Sand.string.strip_html_tag(text_content);
                text_content = Sand.string.multiple_spaces_to_one(text_content);
                tmp = text_content.split(' ');
            }
            else //---. This should be easy 
            {
                if (text_content.indexOf("<div>" + sep + "</div>") != -1)
                    tmp = text_content.split("<div>" + sep + "</div>");
                if (text_content.indexOf("<p>" + sep + "</p>") != -1)
                    tmp = text_content.split("<p>" + sep + "</p>");
                else
                    tmp = text_content.split(sep);
            }

            var h;

            $.each(tmp, function (i, e) {
                //we must clean HTML here because the newline_separator (---)
                //might be wrapped within a <p></p> tag

                h = Sand.string.trim_br($.htmlClean(e, {format: true}));
                if (h != '') {
                    ret.push(h);
                }
            });
            return ret;
        }

    });
});
