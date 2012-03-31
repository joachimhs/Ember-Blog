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
 * Time: 1:10 PM
 * To change this template use File | Settings | File Templates.
 */

setTimeout(function() {
    EmberBlog.stateManager = Ember.StateManager.create({
        rootElement: '#emberArea',
        initialState: 'showMainView',

        showMainView: Ember.ViewState.create({
            enter: function(stateManager) {
                this._super(stateManager);
                console.log('ENTER');
                EmberBlog.PostsListController.set('content', EmberBlog.store.findAll(EmberBlog.Post));
                EmberBlog.FeaturedProjectsController.set('content', EmberBlog.store.findAll(EmberBlog.FeaturedProject));
                EmberBlog.HeaderLinksController.set('content', EmberBlog.store.findAll(EmberBlog.HeaderLink));
            },

            view: Em.ContainerView.create({
                childViews: ['postListView', 'rightAreaView'],

                postListView: Em.View.extend({
                    elementId: 'contents',
                    templateName: 'post-list-view',
                    contentBinding: 'EmberBlog.PostListController.content'
                    //classNames: ['thumbnailViewList']
                }),

                rightAreaView: Em.View.extend({
                    elementId: 'rightArea',
                    templateName: 'right-area-view'
                })
            })
        }),

        showPostView: Ember.ViewState.create({
            view: EmberBlog.View.create({
                elementId: 'post',
                contentBinding: 'EmberBlog.PostController.markdown'
            })
        }),

        showPageView: Ember.ViewState.create({
            view: EmberBlog.View.create({
                elementId: 'post',
                contentBinding: 'EmberBlog.PageController.markdown'
            })
        })
    }),

    EmberBlog.routes = Em.Object.create({
        currentRoute: null,

        gotoRoute: function(routeParams) {
            console.log('EmberBlog.routes gotoRoute. type: ' + routeParams.type + " id: " + routeParams.id);
            if(routeParams.type === 'post' && routeParams.id) {
                EmberBlog.PostsListController.selectPostWithId(routeParams.id);
                ember_disqus_identifier = '/post/' + routeParams.id ;
                ember_disqus_url = 'http://haagen.name/post/' + routeParams.id ;
                ember_disqus_title = routeParams.id;
                EmberBlog.stateManager.goToState('showPostView');
            } else if(routeParams.type === 'page' && routeParams.id) {
                EmberBlog.HeaderLinksController.selectLinkWithId(routeParams.id);
                ember_disqus_identifier = '/page/' + routeParams.id ;
                ember_disqus_url = 'http://haagen.name/page/' + routeParams.id ;
                ember_disqus_title = routeParams.id;
                EmberBlog.stateManager.goToState('showPageView');
            } else if (routeParams.type === 'main') {
                EmberBlog.stateManager.goToState('showMainView');
                ember_disqus_identifier = '/main';
                ember_disqus_url = 'http://haagen.name/'
                ember_disqus_title = 'Haagen.name';
                EmberBlog.PostListController.set('selectedPost', null);
            }
        }
    });

    SC.routes.add(":type/:id", EmberBlog.routes, 'gotoRoute');
    SC.routes.add(":type", EmberBlog.routes, 'gotoRoute');
}, 50);