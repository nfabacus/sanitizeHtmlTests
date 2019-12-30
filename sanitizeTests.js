const sanitizeHtml = require('sanitize-html');

var html = "<strong>hello world</strong>";
console.log(sanitizeHtml(html));

const options = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
  allowedAttributes: {
    p: [ 'class' ],
    img: [ 'src']
  }
};
// img tag
console.log(sanitizeHtml("<img src='https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&auto=format&fit=crop&w=2001&q=80' onerror=alert('img') />", options));  // img is removed by default, but allowedTags will keep img tag while removing onerror in the tag. Also, add src for image address in the option above.
console.log(sanitizeHtml('<img SRC="javascript:alert(1);"/>', options)); // still removes any javascript from src.
console.log(sanitizeHtml('<img SRC="JaVaScRiPt:alert(1);"/>', options)); // still removes any javascript from src.
console.log(sanitizeHtml('<img SRC=JaVaScRiPt:alert(1) />', options)); // still removes any javascript from src.
// a tag
console.log(sanitizeHtml(`<a href="javascript:alert('Executed javascript from a tag!')" >Click this link</a>`));
console.log(sanitizeHtml(`<a href="https://www.google.com" >visit google.com</a>`));

//　script tag
console.log(sanitizeHtml("<script>alert('hello world 2')</script>"));  // script is completely removed
console.log(sanitizeHtml("<button>alert('Clicked button!')</button>"));  // button tag is removed but leaves the child string.

//input and textarea
console.log(sanitizeHtml('<input type="search" value="here is an input text."/>'));  // input tag is completely removed.
console.log(sanitizeHtml('<textarea value="this is a textarea text."/>'));  // textarea tag is completely removed.
console.log(sanitizeHtml('<p class="text">This is a test paragraph with css class</p>', options)); // class is removed by default but I added class to be included in the above options.

console.log(sanitizeHtml('<style>.text{ color: red; }</style>'));  // style tag is completely removed.
