The RIA MVC Model
=================

Disclamer: This blog-post is adapted from my talk about "Building Rich Internet Applications using SproutCore and Cappuccino",
which I held at <a href="http://rootsconf.no/talks/5">The Roots Conference</a> in Bergen the 24th of May 2011.
The slides from the talk are available on <a href="http://public.iwork.com/document/?d=SproutCore_and_Capp,_Roots2011.key&a=p9380587">iWork.com</a>.

We have had a number of very good server-side frameworks for building Web 2.0 Internet applications for a number of years,
and they all helped spike the AJAX "revolution" for the Web. AJAX finally gave us a genuine dynamic feel to the Web,
which was a very welcomed change for the users. However, everything still felt a lot like Web 1.0 on the server side,
which there are two main reasons for.

Server-side state management and markup generation
--------------------------------------------------

With the server-side models the complete MVC model resides server side. The various MVC models usually looks slightly
like the Sun MVC Model 2:

![Sub MVC Model 2](images/ria_mvc_1.png)

In this model the server is responsible for managing the user state for each user currently logged into the system.
As the number of users increase, so does the task of managing all of that intricate state for each session. The down
side here is that this makes the application less scalable while at the same time being harder to load balance and
cluster as this user state either needs to be replicated across all nodes in the cluster or sticky-session load balancing
needs to be implemented.

Also, the server is responsible generating the complete stack of HTML, CSS and JavaScript needed to display t
he website in the browser. AJAX and Web 2.0 made this issue even worse as the generated markup now also had to fit
well with whatever was currently being displayed in the browsers DOM-tree. So not only did the server have to know
the users state in order to fetch the correct data for the response, but the response also had to be carefully constructed
so that it would work well with the current state on the client-side.

The move towards RIA
--------------------

The main objective of RIA is to let the client do what the client does best, **rendering and displaying websites**,
while leaving the server side to work on what it does best, **retrieving, persisting and serving data to the clients**.

The initialization of a RIA application usually starts with an initial request for the complete application:

![Initial Request](images/ria_mvc_2.png)

The client will then parse the application and load up a full blown MVC model that will reside completely inside the
browser, and might look something like the following, which is the the MVC model used by the RIA framework
[SproutCore](http://www.sproutcore.com/):

![Client MVC](images/ria_mvc_3.png)

Now, this is where things start to get interesting. The RIA application now has the capability to work on a local
cache of the data, while still being able to request additional data from the server when needed in an asynchronous manner.
And this is a key point with RIA applications: After the initial request for the RIA application, the client-side never
has to ask for or receive any markup, stylesheets or scripts from the server side. The communication between the client
and the server has effectively been reduced to only the data required to be able to show the client-side GUI.

It also means that the client-side application requires more control on how the application is structured and how
updates to either the view (by the user), or to the model (by the server) is propagated throughout the application.
In SproutCore this process is referred to as the "V-Property", coined by [Erich Atlas Ocean](http://erichocean.com/),
although the V-Property works in a similar manner on any framework that supports observing and binding.

The V-Property
--------------

The V-Property consists of 5 steps and describes how changes to any layer in the application will propagate out through
to the rest of the application.

![The V-Property](images/ria_mvc_4.png)

There are a couple of important aspects of the V-Property worth mentioning. The first is that a change can occur
anywhere along the path, but that changes will only propagate "upwards" (in numbers), second that a step should never be
repeated, and third that a step might be skipped along the way. 1 -> 3 -> 4 -> 5, and 3 -> 4 -> 5 are both valid paths
through the V-Property, while 1 -> 3 -> 2 -> 4 -> 5 is not. Normally though, the most common paths is either all the way
from 1 through to 5 (a user-triggered event on the GUI), and from 3 through to 5 (changes to the datastore). A full path
through the V-Property will issue the following changes:

- User/SproutCore event - Usually either a user-issued action or a timer-event
- (Controller) Action	- The User/event calls upon a controller action to perform some task, either requesting additional data or performing changes to the GUI.
- Model Mapping 		- The controller calls into the datastore requesting additional data
- Observing				- The controller acts as a mediator of the data between the data-store and the view, and observes changes made to the data-store
- View Redraw			- Properties in the view are bound to properties in the controller, and will propagate automatically up to the view when the value its bound to changes.

Connecting the server
---------------------

If we connect a server in the diagram, it might look like the following. Note that the server can be either more complex,
or less complex, written in Java, C, .Net, etc. as long as the server-side supports HTTP and are able to deliver data in
a format that the client can understand. JSON is most common as the data-type, but in reality the communication format
might be XML, CSV or any other format that can be transferred over the HTTP protocol.

!![Server and Client side MVC Models](images/ria_mvc_5.png)

If we imagine having a client application that lets the user select an item form a list in the GUI. That selection (C1)
is triggering an action on the items controller (C2), which in turn is issuing a request to the model-layer for the data
related to the item being selected. Since that data is not available from the data-store, it will need to be fetched from
the server. SproutCore will then immediately create a record representing the item being requested (C3), which in turn
will update the controllers item (C4). As changes to the controllers item is bound to the view, the view will be updated
immediately (C5). At the same time as S4, the data-store will issue an XHR call to the server to request data for the
requested item (S1). The server-side MVC framework will make sure that S2, S3 and S4 is called in the right order before
sending the item back to the client as the XHR response (S5). When the item is retrieved at the client, the data-store
will update the model (C3), which in turn again will trigger the steps C4 and C5 to update both the controller and the view.

