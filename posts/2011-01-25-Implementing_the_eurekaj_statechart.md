Why implement Statecharts ?
===========================
	
Have you ever been frustrated about the number of code lines that you have in you Model-View-Controller application (MVC) for managing the current state of the application ? Is determining the overall state of the application hard to figure out, and generally a mess to debug ? Does your GUI tend to show the wrong panels, have overlapping panels and in general have recurring bugs with its state ? Then Statecharts are the way to go to achieve a cleaner, testable and less error-prone GUI. 

The main advantage, for me, using statecharts is the clean seperation of concerns between the GUI View layer and the Controller-layer in an MVC-Application. Instead of mixing controller-logic with code that attempts to determine "what is currently visible to the user" a Statechart can be used to model each state that the application has, as well as expose action-methods that allow transition between states. 

A state has a single entry-point and a single exit-point. The entry-point is responsible for determining what the user is currently able to see based on the users event and the current available data, while the exit-point is responsible for tearing down the views that the user is no longer able to see. An important aspect of the statechart is that no state is ever going to be concerned about how the user got to that particular state. It will respond at its entry-point with setting up the GUI based on the current action being performed and the data available at that point in time. That way, when the states entry-point is finished executing the GUI will be setup correctly for that state. In a similar manner the states exit-point will tear down/hide the GUI elements that are only applicable to view for that state. 

Then, you might ask, how will you ever be able to set up a complex gui without having to enable and disable views multiple times ? 

Complex GUI ? Nested states to the rescue!
------------------------------------------

Any more complex GUI will have nested states, and the user can transition into a state that is nested deep inside the applications statechart. Whenever a user performs a function that is nested deep inside the application logic, say, for instance loggedIn -> showLeftMenu -> showAlertMenu the SproutCore Statechart API will make sure that each states' enterState function will get called in a hierarchical manner, which is one of the reasons why states are not concerned with how the user got to that state. Whenever SC navigates to a new state, that states 'initialSubstate' will be the currently selected substate.

Most applications will have multiple states, and they will most likely be nested so that they reflect the requirements on what and how information is presented to the user. Whenever you find yourself in your application wanting to write code like "tabPanelisVisible: NO" inside your controller you will most likely want to implement that logic as a statechart instead with the benefit that your views' state become unambiguous to both the developers and the user. EurekaJ View has a few examples of nested states. Nested states are reflected in the statechart below as nested boxes.

SproutCore implements nested states as "substates".

Concurrent states - States that are 'active' at the same time
-------------------------------------------------------------

Some applications allow the user to view multiple states of the application at the same time. One example of this is an email application where both the list of mailboxes, the list of emails in the currently selected mailbox as well as the contents of the currently selected email is presented to the user at the same time. In such an application all three states, 'showingMailboxes', 'showingMailboxContents' and 'showingSelectedEmailContents' is active at the same time. In such an application it is most likely true that an action in either of these states might act on any of the other active states. For instance, if the user selects a new mailbox, the 'showingSelectedEmailContents' will be exited, while at the same time an action in the 'showingMailboxContents' might be called upon to refresh the contents of that view.

This functionality is implemented in SproutCore's Statecharts as concurrent states using the

    substatesAreConcurrent: YES

property of any state.

Initializing the Statechart
---------------------------

There are many ways to initialize an applicattions statechart, by favourite method is by using the mixin SC.StatechartManager to SC.Application.create(), which is most commonly located inside core.js. Then, it is rather easy to initialize the applications statechart using the rootState parameter:

    rootState: SC.State.extend({ initialSubstate: 'mainState', mainState: SC.State.plugin('EurekaJView.statechart') })

The above statement defines the initial root state for the application. It starts out by defining a new 'mainState' which is initialized using the SC.State.plugin with a reference to the statechart object. The statechart object is defined in its own file in EurekaJView called core_statechart.js.

Now that we have an initialized statechart in place, it is time to have a look at the statechart for EurekaJView.

Implementing the EurekaJ Main Statechart
----------------------------------------

![Statechart Implementation](images/statechart_implementation1.png)

The application starts out in the "loggedOut" state, which is the "initialSubstate". From there on it can perform a single action, "authenticate". The Authenticate method has two outcomes, "authenticationFailed" and "authenticationSucceeded". The first of which will send the user back to the "showingLoginPanel", while the latter will change state to the "loggedIn" state, which is where most of the application takes place. (Logging in and Authentication is not yet implemented in EurekaJ as of Januray 2011, but will be in place before EurekaJ reached version 1.0). 

EurekaJ View is structured like many other applications, There is a top-hand toolbar where the most common user actions are availbale, a left-hand sidebar with a set of tree lists of available data, and a larger main area where the selected data is presented. These three views are all available to the user at the same time, and as such, they are implemented as concurrent states. 

The top-menu is currently used to show modal-panels with either a Time Period selector, or an administration panel for setting up alerts, instrumentation groups and email recipients for alerts. The "showingTopMenu" state can only display one of these panels at a time. 

The left-hand menu has a tab-view where the user can choose to see the "instrumentation menu", the "alert menu", the "instrumentation Group" menu or the "Dashboard menu". Each of these states will show either a tree or a list with available charts. When a menu-item is clicked the chart or charts for that node is displayed in the "showingChart" state. 

EurekaJ View is currently a work in progress, and as such, not all the substates are implemented in code just yet :)

StateChart Code
---------------
The complete sourcecode for EurekaJ View is licensed under the GPLv3 license and is available at [GitHub](https://github.com/joachimhs/EurekaJ).

The code below is using SproutCore from the master branch (1.5), which have Statecharts built in. If you are using SproutCore from the gem (1.4.4), you need to place the KI framework inside your "frameworks" directory and replace SC with KI in the code below. KI kan be found here: https://github.com/FrozenCanuck/Ki.

### core_statechart.js


    /*globals EurekaJView */

    EurekaJView.statechart = SC.State.design({

        initialSubstate: 'loggedIn',

        loggedIn: SC.State.design({


            substatesAreConcurrent: YES,

            showingLeftMenu: SC.State.design({
                enterState: function() {
                    EurekaJView.mainPage.get('instrumentationTreeView').set('isVisible', YES);
                    EurekaJView.mainPage.get('instrumentationTreeScrollView').set('isVisible', YES);
                    EurekaJView.InstrumentationTreeController.triggerTimer();
                    EurekaJView.InstrumentationTreeController.timer.set('isPaused', NO);
                    SC.Logger.log('entered showInstrumentationMenu');
                },

                exitState: function() {
                    EurekaJView.mainPage.get('instrumentationTreeView').set('isVisible', NO);
                    EurekaJView.mainPage.get('instrumentationTreeScrollView').set('isVisible', NO);
                    EurekaJView.InstrumentationTreeController.timer.set('isPaused', YES);
                    SC.Logger.log('exited showInstrumentationMenu');
                }
            }),

            showingTopMenu: SC.State.design({
                enterState: function() {
                    EurekaJView.mainPage.get('topView').set('isVisible', YES);
                    SC.Logger.log('entered showTopMenu');
                },

                exitState: function() {
                    EurekaJView.mainPage.get('topView').set('isVisible', NO);
                    SC.Logger.log('exited showTopMenu');
                },

                initialSubstate: 'ready',


                ready: SC.State.design({

                }),

                /* ACTIONS */
                showTimeperiodPaneAction: function() {
                    this.gotoState('showingTimePeriodPanel');
                },

                hideTimeperiodPaneAction: function() {
                    this.gotoState('ready');
                },

                showAdministrationPaneAction: function() {
                    EurekaJView.EurekaJStore.find(EurekaJView.ALERTS_QUERY);
                    EurekaJView.EurekaJStore.find(EurekaJView.ADMINISTRATION_TREE_QUERY);
                    EurekaJView.EurekaJStore.find(EurekaJView.INSTRUMENTATION_GROUPS_QUERY);
                    EurekaJView.EurekaJStore.find(EurekaJView.EMAIL_GROUPS_QUERY);

                    EurekaJView.updateAlertsAction();
                    EurekaJView.updateInstrumentationGroupsAction();
                    EurekaJView.updateEmailGroupsAction();

                    this.gotoState('showingAdminPanel');

                },

                hideAdministrationPaneAction: function() {
                    this.gotoState('ready');
                },

                /* //ACTIONS */

                hideTimePeriodPanel: SC.State.design({
                    enterState: function() {
                        SC.Logger.log("Entering hideTimePeriodPanel State");
                        EurekaJView.mainPage.get('timePeriodView').remove();
                    },

                    exitState: function() {
                        SC.Logger.log("Exiting hideTimePeriodPanel State");
                    }
                }),

                showingTimePeriodPanel: SC.State.design({
                    enterState: function() {
                        SC.Logger.log("Entering showTimePeriodPanel State");
                        EurekaJView.mainPage.get('timePeriodView').append();
                    },

                    exitState: function() {
                        SC.Logger.log("Exiting showTimePeriodPanel State");
                        EurekaJView.mainPage.get('timePeriodView').remove();
                    }
                }),

                showingAdminPanel: SC.State.design({
                    enterState: function() {
                        SC.Logger.log("Entering showAdminPanel State");
                        EurekaJView.mainPage.get('adminPanelView').append();
                    },

                    exitState: function() {
                        SC.Logger.log("Exiting showAdminPanel State");
                        EurekaJView.mainPage.get('adminPanelView').remove();
                    }
                })

            })

        })
    });

<h2>Graphical User Interface</h2>
![Statechart GUI](images/statechart_gui1.png)