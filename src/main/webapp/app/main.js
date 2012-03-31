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
    postShortIntro: DS.attr('string'),
    postLongIntro: DS.attr('string')
});

EmberBlog.Post.reopenClass({
    url: '/posts.json'
});

EmberBlog.FeaturedProject = DS.Model.extend({
    primaryKey: 'id',
    id: DS.attr('string'),
    projectTitle: DS.attr('string'),
    projectDescription: DS.attr('string'),
    projectUrl: DS.attr('string')
});

EmberBlog.FeaturedProject.reopenClass({
    url: '/featuredProjects.json'
});

EmberBlog.HeaderLink = DS.Model.extend({
    primaryKey: 'id',
    linkTitle: DS.attr('string'),
    href: DS.attr('string')
});

EmberBlog.HeaderLink.reopenClass({
    url: '/headerLinks.json'
});

EmberBlog.FeaturedProjectsController = Em.ArrayProxy.create({
    content: []
});

EmberBlog.PostsListController = Em.ArrayProxy.create({
    content: [],
    continueSearch: true,

    postsObserver: function() {
        EmberBlog.PostListController.addPosts(this.get('content'));
    }.observes('content.length'),

    selectPostWithId: function(id) {
        console.log('finding post with id: ' + id);
        var foundPost = null;
        this.get('content').forEach(function(post) {
            console.log('comparing: ' + post.get('id') + ' with: ' + id);
            if (post.get('id') === id) {
                foundPost = post;
            }
        });

        if (!foundPost && EmberBlog.PostsListController.get('continueSearch')) {
            setTimeout(function() {
                EmberBlog.PostsListController.set('continueSearch', false);
                EmberBlog.PostsListController.selectPostWithId(id);
            }, 150);
        } else {
            EmberBlog.PostListController.set('selectedPost', foundPost);
            EmberBlog.PostsListController.set('continueSearch', true);
        }

        return foundPost;
    }
});

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
            console.log('getting contents for Post: ' + this.get('content').get('id'));
            var markdown = $.get("/posts/" + this.get('content').get('postFilename'), function(data) {
                EmberBlog.PostController.set('markdown', data);
            }, "text");
        } else {
            this.set('markdown', null);
        }
    }.observes('content')
});

EmberBlog.HeaderLinksController = Em.ArrayProxy.create({
    content: [],
    selectedLink: null,
    continueSearch: true,

    selectLinkWithId: function(id) {
        console.log('finding link with id: ' + id);
        var foundPost = null;
        this.get('content').forEach(function(post) {
            console.log('comparing: ' + post.get('id') + ' with: ' + id);
            if (post.get('id') === id) {
                foundPost = post;
            }
        });

        if (!foundPost && EmberBlog.HeaderLinksController.get('continueSearch')) {
            setTimeout(function() {
                EmberBlog.HeaderLinksController.set('continueSearch', false);
                EmberBlog.HeaderLinksController.selectLinkWithId(id);
            }, 150);
        } else {
            EmberBlog.HeaderLinksController.set('selectedLink', foundPost);
            EmberBlog.HeaderLinksController.set('continueSearch', true);
        }

        return foundPost;
    }
});

EmberBlog.PageController = Em.Object.create({
    contentBinding: 'EmberBlog.HeaderLinksController.selectedLink',
    markdown: null,

    contentObserver: function() {
        if (this.get('content')) {
            console.log('getting contents for Link: ' + this.get('content').get('linkFilename'));
            var markdown = $.get("/pages/" + this.get('content').get('linkFilename'), function(data) {
                EmberBlog.PageController.set('markdown', data);
            }, "text");
        } else {
            this.set('markdown', null);
        }
    }.observes('content')
});