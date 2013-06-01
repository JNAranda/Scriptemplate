Scriptemplate Engine
====================

.bind(template, dataSource)
-------
Binds a scriptemplate and a JavaScript Object together to return an array of one or more html nodes with the appropriate data and features.
### Arguments
* <code>template</code>
A scriptemplate, described below.

* <code>dataSource</code>
A JavaScript object, probably JSON that has been de-stringified.

scriptemplate
-------------
A scriptemplate is a JavaScript object that defines the structure, attributes, and text content of DOM nodes.

Start with declaring an object like so:
<pre><code>
var fruitListTemplate = {
	tag: 'ul'
}
</code></pre>

Congratulations. You've just defined an unordered list element.
Let's add some list items to it using some data on fruit we just happen to have lying around.
Our data:
<pre><code>
var fruitData = {
	fruit: {
		Apple: {
			colors: ['red', 'green', 'yellow'],
			wouldMakePieOutOfIt: "yes",
			keepsTheDoctorAway: true
		},
		Orange: {
			colors: ['orange'],
			wouldMakePieOutOfIt: "no",
			keepsTheDoctorAway: false
		},
		Pear: {
			colors: ['green', 'yellow'],
			wouldMakePieOutOfIt: "maybe"
		}
	}
}
</code></pre>
And now the scriptemplate - we'll want to add a property called children, which is going to hold our ul's child node definitions.
<pre><code>
var fruitListTemplate = {
	tag: 'ul',
	children: [
		{
			tag: 'li',
			text: 'A fruit!'
		}
	]
}
</code></pre>
At this point, if we fed this scriptemplate into bind(), we'd get this:
<ul>
	<li>A Fruit!</li>
</ul>
This is fine, but we can define DOM nodes statically in html more easily - the 
point is to work with the data.
So add the property "repeatFor: 'fruit'" to the list item we just defined.
<pre><code>
var fruitListTemplate = {
	tag: 'ul',
	children: [
		{
			tag: 'li',
			text: 'A fruit!',
			repeatFor: 'fruit'
		}
	]
}
</code></pre>
 
If we run bind() again, we'd get a node structure like this:
<ul>
	<li>A Fruit!</li>
	<li>A Fruit!</li>
	<li>A Fruit!</li>
</ul>
because we instructed the template parser to repeat the list item directive 
(the object with tag: 'li') for each item in the "fruit" property on the root of the data source.

We can access the data in each item in fruit too. Replace the li text directive with the string "{.}"
<pre><code>
var fruitListTemplate = {
	tag: 'ul',
	children: [
		{
			tag: 'li',
			text: '{.}',
			repeatFor: 'fruit'
		}
	]
}
</code></pre>
The "{" and "}" brackets are a data expression that tells the scriptemplate parser to insert the data found in the named property at the current scope
(in this case, the scope is fruit[n]) at the place of the brackets.

If the data expression ends in a dot (".") the parser will use the current key for the object it is scoped to, which in our case 
will be each of the object keys within the "fruit" object. Thus the result of bind(fruitListTemplate, fruitData); should be:
<ul>
	<li>Apple</li>
	<li>Orange</li>
	<li>Pear</li>
</ul>

