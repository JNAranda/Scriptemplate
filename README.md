Scriptemplate
=============

It's a script! It's a template!
It's Scriptemplate (say it like contemplate).

The Scriptemplate project arose out of both the author's curiosity and the need for a 
front-end html templating solution that plays nice with JavaScript.

But those ARE out there? Many template parsers rely on / are plugins to another library. Scriptemplate does not 
require any library.

Additionally, Looking at other templating frameworks on the internet, many are jsp-like, focused on 
maintaining some semblance of HTML-ness, stuffing HTML inbetween javascript. These are very convenient 
to write for if all one knows is HTML and CSS, but the benefits of writing a template in pure JavaScript
are clear:

* We can simply send a Scriptemplate alongside data (as a Scriptemplate should be valid JSON). No assembly required.

* We get to write our conditionals in pure JavaScript:
<pre><code>
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

</pre></code>	
Scriptlets are dead, and we need to move on.

Basically, with a Scriptemplate, you configure your nodes. If you want to write your templates
in HTML, Scriptemplate is not for you: though there may be an html preprocessor in the works 
to help initially flesh out a Scriptemplate by way of reverse engineering.

