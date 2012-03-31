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

/**
 * Created by IntelliJ IDEA.
 * User: joahaa
 * Date: 3/19/12
 * Time: 1:33 PM
 * To change this template use File | Settings | File Templates.
 */

EmberBlog.PostIntroView = Ember.View.extend({
    templateName: "post-intro-view",
    classNames: ['hand'],

    click: function() {
        EmberBlog.PostListController.set('selectedPost', this.get('content'));
        //EmberBlog.stateManager.goToState('showPostView');
        SC.routes.set("location", "post/" + this.get('content').get('id'));
    }
});

EmberBlog.View = Ember.View.extend({
    templateName: "post-view",
    classNames: ['postView'],

    contentObserver: function() {
        this.rerender();
    }.observes('content')
});

EmberBlog.BackToMainView = Ember.View.extend({
    classNames: ['hand'],

    click: function() {
        SC.routes.set("location", "main");
    }
});

EmberBlog.LinkView = Ember.View.extend({
    tagName: 'span',
    classNames: ['hand', 'headerLink'],

    click: function() {
        console.log('clicked link: ' + this.get('content').get('linkTitle'));

        if (this.get('content').get('href')) {
            window.location = this.get('content').get('href');
        } else {
            SC.routes.set("location", "page/" + this.get('content').get('id'));
        }
    }
});

EmberBlog.DisqusView = Ember.View.extend({
    render: function(buffer) {
        console.log('RENDER');
        buffer.push('<script type="text/javascript" src="http://joachimhs.disqus.com/combination_widget.js?num_items=5&hide_mods=0&color=blue&default_tab=people&excerpt_length=200"></script><a href="http://disqus.com/">Powered by Disqus</a>');
    }
    //defaultTemplate: Ember.Handlebars.compile('<script type="text/javascript" src="http://joachimhs.disqus.com/combination_widget.js?num_items=5&hide_mods=0&color=blue&default_tab=people&excerpt_length=200"></script><a href="http://disqus.com/">Powered by Disqus</a>')
});

