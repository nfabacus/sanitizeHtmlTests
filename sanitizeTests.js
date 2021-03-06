const sanitizeHtml = require('sanitize-html');

var html = "<strong>hello world</strong>";
console.log(sanitizeHtml(html));

const options = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'span' ]),
  allowedAttributes: {
    a: ['href', 'rel', 'target'],
    div: ['class', 'style'],
    p: [ 'class', 'style' ],
    strong: [ 'class', 'style' ],
    em: [ 'class', 'style' ],
    span: [ 'class', 'style' ],
    img: [ 'src', 'width', 'height', 'style', 'class' ],
    iframe: ['src', 'width', 'height', 'style', 'class']
  },
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
};
// img tag
console.log(sanitizeHtml("<img src='https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&auto=format&fit=crop&w=2001&q=80' onerror=alert('img') />", options));  // img is removed by default, but allowedTags will keep img tag while removing onerror in the tag. Also, add src for image address in the option above.
console.log(sanitizeHtml('<img SRC="javascript:alert(1);"/>', options)); // still removes any javascript from src.
console.log(sanitizeHtml('<img SRC="JaVaScRiPt:alert(1);"/>', options)); // still removes any javascript from src.
console.log(sanitizeHtml('<img SRC=JaVaScRiPt:alert(1) />', options)); // still removes any javascript from src.
// a tag
console.log(sanitizeHtml(`<a href="javascript:alert('Executed javascript from a tag!')" >Click this link</a>`, options));
console.log(sanitizeHtml(`<a href="https://www.google.com" rel="noopener noreferrer" target="_blank">test link</a>`, options));

// exclusive filter
console.log('exclusive filter');
const specialOptions = {
  ...options,
  exclusiveFilter: function(frame) {
    console.log('filter>>>', frame.attribs.href.startsWith('https://mysite.com'));
    return frame.tag === 'a' && !frame.attribs.href.startsWith('https://myallowedsite.com');
  }
};
console.log(sanitizeHtml(`<a href="https://www.google.com" rel="noopener noreferrer" target="_blank">any link</a>`, specialOptions));
console.log(sanitizeHtml(`<a href="https://myallowedsite.com" rel="noopener noreferrer" target="_blank">allowed link</a>`, specialOptions));

const specialOptions2 = {
  ...options,
  exclusiveFilter: function(frame) {
    console.log('filter>>>', frame.attribs.src.startsWith('https://myallowedsite.com'));
    return frame.tag === 'img' && !frame.attribs.src.startsWith('https://myallowedsite.com');
  }
};
console.log(sanitizeHtml("<img src='https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&auto=format&fit=crop&w=2001&q=80' onerror=alert('img') />", specialOptions2));
console.log(sanitizeHtml("<img src='https://myallowedsite.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&auto=format&fit=crop&w=2001&q=80' onerror=alert('img') />", specialOptions2));

//　script tag
console.log(sanitizeHtml("<script>alert('hello world 2')</script>"));  // script is completely removed
console.log(sanitizeHtml("<button>alert('Clicked button!')</button>"));  // button tag is removed but leaves the child string.

//input and textarea
console.log(sanitizeHtml('<input type="search" value="here is an input text."/>'));  // input tag is completely removed.
console.log(sanitizeHtml('<textarea value="this is a textarea text."/>'));  // textarea tag is completely removed.

// p tag
console.log(sanitizeHtml('<p class="text" style="color:green">This is a test paragraph with css class and style</p>', options)); // class is removed by default but I added class to be included in the above options.

// div tag
console.log(sanitizeHtml('<div class="text" style="color:yellow">This is a test div with css class and style</div>', options)); // class is removed by default but I added class to be included in the above options.


// button
console.log(sanitizeHtml('<button onclick="console.log(\'You clicked a button you should not have!\')">Click me!</button>'));

// select
console.log(sanitizeHtml('<select></select>'));

// inline style
console.log(sanitizeHtml('<p style="background-image: url(javascript:alert(7))">test paragraph 1</p>', options));  // The above options allow style and can retain injected code, but modern browsers do not seem to allow the xss code to run.
console.log(sanitizeHtml('<p style="width: expression(alert(\'XSS\'));">test paragraph 2</p>', options)); // The above options allow style and can retain injected code, but modern browsers do not seem to allow the xss code to run.

// style tag
console.log(sanitizeHtml("<style>p[foo=bar{}*{-o-link:'javascript:alert(1)'}{}*{-o-link-source:current}*{background:red}]{background:green};</style>", options)); // style tag is completely removed.
console.log(sanitizeHtml('<style>.text{ color: red; }</style>'));  // style tag is completely removed.

console.log(sanitizeHtml('<p><iframe src="https://www.youtube.com/embed/nykIhs12345" class="test" style="color: green"></iframe><p>', options));
