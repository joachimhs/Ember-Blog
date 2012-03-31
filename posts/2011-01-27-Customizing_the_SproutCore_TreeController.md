Customizing the SproutCore TreeController with a custom icon for leaf nodes
===========================================================================

In the SproutCore client I wanted to display a customized icon for the leaf nodes, depending on the type of node.
Each node has a "nodeType" parameter that can either be "chart", "alert" og "groupedStatistic", and I wanted to display
a custom icon for each of the different nodes like this:

![SproutCore TreeNode](images/sproutcore_treenode1.png)

As you can see from the image above, the chart nodes have a image of a chart, the alert node of a warning triangle while
the Grouped Statistics node has an icon with a "G" in it.

Calculated property on the model
--------------------------------

The first thing I needed to do was to add a calculated property on the model object for the treenode, which I called "itemIcon". This property would return the correct image if the node has no children (is a leaf node), based on the model property "nodeType". If the node is either not a leaf node, or has the correct nodeType, the function return null, telling SproutCore that no icon will be necessary for this particular node.

Following is the full data-model for the tree items:

    EurekaJView.InstrumentationTreeModel = SC.Record.extend(
    /** @scope EurekaJView.InstrumentationTreeModel.prototype */
    {

        primaryKey: 'guiPath',
        guiPath: SC.Record.attr(String),

        name: SC.Record.attr(String),
        isSelected: SC.Record.attr(Boolean),
        parentPath: SC.Record.attr(String),
        hasChildren: SC.Record.attr(Boolean),
        treeItemIsExpanded: NO,
        childrenNodes: SC.Record.toMany('EurekaJView.InstrumentationTreeModel'),
        chartGrid: SC.Record.toMany('EurekaJView.ChartGridModel'),
        nodeType: SC.Record.attr(String),

        treeItemChildren: function() {
            if (this.get('childrenNodes').toArray().length === 0) {
                return null;
            } else {
                return this.get('childrenNodes');
            }
        }.property(),

        itemIcon: function() {
            if (!this.get('hasChildren') && SC.compare(this.get('nodeType'), "chart") == 0) {
                return static_url('images/ej_chart_16.png');
            } else if (!this.get('hasChildren') && SC.compare(this.get('nodeType'), "alert") == 0) {
                return static_url('images/ej_chart_alert_16.png');
            } else if (!this.get('hasChildren') && SC.compare(this.get('nodeType'), "groupedStatistics") == 0) {
                return static_url('images/ej_groupedstats_16.png');
            } else {
                return null;
            }
        }.property()


    });

The images, as the code suggest is placed inside /resources/images and named accordingly.

Making the view show the icon
-----------------------------

The view in question is a SC.ListView, an in order to customize the way each row is shown, it is necessary to define an
exampleView for the list like so:


    instrumentationTreeScrollView: SC.ScrollView.extend({
        isVisible: NO,
        layout: {
            top: 101,
            bottom: 0,
            left: 2,
            width: 299
        },
        canScrollHorizontally: YES,
        hasHorizontalScroller: YES,

        contentView: SC.ListView.extend({
            backgroundColor: '#F0F8FF',
            contentValueKey: "name",
            rowHeight: 18,
            borderStyle: SC.BORDER_NONE,

            contentBinding: 'EurekaJView.InstrumentationTreeController.arrangedObjects',

            selectionBinding: 'EurekaJView.InstrumentationTreeController.selection',
            selectionDelegate: EurekaJView.treeMenuSelectionDelegate,

            exampleView: EurekaJView.InstrumentationTreeListItem,
            recordType: EurekaJView.InstrumentationTreeModel
        }),

        borderStyle: SC.BORDER_NONE
    })

The last missing piece is the implementation of EurekaJView.InstrumentationTreeListItem. As this class extends the
SC.ListItemView the implementation is rather simple with only a single binding to the "itemIcon" calculated property
from above:


    EurekaJView.InstrumentationTreeListItem = SC.ListItemView.extend(
        /** @scope EurekaJView.InstrumentationTreeListItem.prototype */ {

        iconBinding: '.content.itemIcon'
    });