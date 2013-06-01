It's a script! It's a template!
It's Scriptemplate (say it like contemplate).

The Scriptemplate project arose out of both the author's curiosity and the need for a 
front-end html templating solution that plays nice with JavaScript.

But those ARE out there?

Looking at other templating frameworks on the internet, many are jsp-like, focused on 
maintaining some semblance of HTML-ness. These are very convenient to write for if all 
one knows is HTML and CSS, but the benefits of writing a template in pure JavaScript
are clear:

> We get to write our conditionals in pure JavaScript:

	tag: 'tr',
	repeatFor: 'employees',
	cls: function(dataContext, dataSource){
		return (dataContext.key % 2 == 0) ? 'stripe' : '';
	},
	children:[
		{
			tag: 'td',
			text: '{.firstName}'
		},{
			tag: 'td',
			text: '{.lastName}'
		},{
			tag: 'td',
			text: '{.department}'
		},{
			tag: 'td',
			text: '{^.company}'
		}
	]
	
 Scriptlets are dead, and we need to move on.
	
> One can send a Scriptemplate alongside data too (as a Scriptemplate should be valid JSON).

> Many template parsers rely on / are plugins to another library. Scriptemplate does not 
require any library.

Basically, with a Scriptemplate, you configure your nodes. If you want to write your template
in HTML, Scriptemplate is not for you: though there may be an html preprocessor in the works 
to help initially flesh out a Scriptemplate by way of reverse engineering.

If you still really want to use Hyper-Texty mark up, check out http://goessner.net/articles/jsont/
or a burgeoning little library at https://github.com/jquery/jquery or any of the stuff in this list:
http://www.jquery4u.com/javascript/10-javascript-jquery-templates-engines/
