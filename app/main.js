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
 * Time: 1:21 PM
 * To change this template use File | Settings | File Templates.
 */

EmberBlog.Post = DS.Model.extend({
    primaryKey: 'id',
    postTitle: DS.attr('string'),
    postDate: DS.attr('string'),
    postShortInto: DS.attr('string'),
    postLongIntro: DS.attr('string'),
    postUrl: DS.attr('string')
});

EmberBlog.Post.reopenClass({
    url: 'posts.json'
});

EmberBlog.PostsListController = Em.ArrayProxy.create({
    content: [],

    postsObserver: function() {
        EmberBlog.PostListController.addPosts(this.get('content'));
    }.observes('content.length')
})

EmberBlog.PostListController = Em.ArrayProxy.create({
    content: [],
    selectedPost: null,

    addPosts: function(posts) {
        this.set('content', []);

        posts.forEach(function(post) {
            EmberBlog.PostListController.add(post);
        });
    },

    add: function(post) {
        this.get('content').insertAt(0, post);
    }
});

EmberBlog.PostController = Em.Object.create({
    contentBinding: 'EmberBlog.PostListController.selectedPost',
    markdown: null,

    contentObserver: function() {
        if (this.get('content')) {
            console.log('getting contents for URL: ' + this.get('content').get('postUrl'));
            var markdown = $.get(this.get('content').get('postUrl'), function(data) {
                EmberBlog.PostController.set('markdown', data);
            });
        } else {
            this.set('markdown', null);
        }
    }.observes('content')
});