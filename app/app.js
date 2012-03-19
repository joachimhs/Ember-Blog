/*
 * Copyright (c) 2012. Joachim Haagen Skeie.
 *
 * MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

EmberBlog = Ember.Application.create({
    ready: function() {
        this._super();
        hljs.initHighlightingOnLoad();
    }
});

EmberBlog.Adapter = DS.Adapter.create({
    findAll: function(store, type) {
        var url = type.url;

        jQuery.getJSON(url, function(data) {
            // data is a Hash of key/value pairs. If your server returns a
            // root, simply do something like:
            //   store.load(type, id, data.person)
            console.log('getting from url: ' + url + ' length: ' + data.length);
            store.loadMany(type, data);
        });
    }
});

EmberBlog.store = DS.Store.create({
    adapter: EmberBlog.Adapter
});

Handlebars.registerHelper('convertMarkdown', function(property) {
    var value = Ember.getPath(this, property);
    if (value) {
        var converter = new Showdown.converter();
        return new Handlebars.SafeString(converter.makeHtml(value));
    }

    return '';
});
