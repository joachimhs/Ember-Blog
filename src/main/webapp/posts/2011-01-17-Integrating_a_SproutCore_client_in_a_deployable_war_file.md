Introduction
============

[EurekaJ Profiler](http://eurekaj.haagen.name) has a frontent Sproutcore (SC) client application that talks to a backend Java application. The Java backend is deployed as a .WAR file and in this particular setting, I wanted to be able to package the Sproutcore application inside the .WAR file. For this approach to be possible I needed the following from the Sproutcore Buildtools:

Relative paths. By default the sc-build tool will use a absolute paths. starting with "/static". This wont work when deploying with a .WAR file because the context path of the deployed application depends very much on how the application is deployed. Relative paths is something that is being worked on for the 1.5 release of the Sproutcore build tools.
Communication with the backend on the same port as the WAR file. The port number the backend application is listening might also vary from deployment to deployment, so it is vital that the Sproutcore Application is able to communicate with the backend on whichever port the backend is listening to. This is important because EurekaJ can be deployed multiple times on the same server, but listening on different ports.
I need a fixed application structure within the Sproutcore application that is consistent between builds. By default the SC buildtools will generate its output into a directory with a build-number. 
Most of the issues above can be fixed by adding parameter to sc-build, however as relative paths is not functioning neither on the stable 1.4.4 release, nor on the master branch, I still needed to either find a different way to package the sproutcore client or write a maven plugin to recusively change the /static reference to a relative path after sc-build had ran.

Garcon to the rescue
--------------------

While Amber (the SC Buildtools) is built in ruby, Garcon is a node.js based built tool for Sproutcore applications. Garcon uses a JavaScript-based buildfile that lets you specify things like proxies, paths to frameworks, how you want the application built, etc. Garcon also comes with functionality to double up as a replacement for sc-server.

The buildfile that I created for EurekaJ is mostly a copy of the standard garcon buildfile example that comes with the Git clone. The main changes that were done was the application, as well as the buildVersion of the finished build so that the built application wouldn't be placed in a build-directory unique for each build. Other than that I made sure that the frameworks required was included in the build. For development and test I do not want my files to be minimized, as this tends to make debugging a lot harder. I have a seperate garcon buildfile that I use when building for production where I make sure that both 'minifyScripts' and 'minifyStylesheets' are set to true.

In order to get garcon up and running you first need to install garcon and node.js.

Installing garcon for the SC 1.4.4 STABLE branch
------------------------------------------------

The main garcon source is avaible at [GitHub](https://github.com/martoche/garcon). I wanted to place garcon inside my project, and so decided to clone garcon into a subfolder named "garcon" into my main Sproutcore project directory by issuing the following command. which is really all that is needed to "install" garcon:

    git clone https://github.com/martoche/garcon.git garcon

Note: Due to some changes between 1.4.4 and the master branch of Sproutcore, if you run into JQuery problems with the martoche version of Garcon, have an attempt with Maurits Lamers version below. 

Installing garcon for the SC master branch
The master SC branch is the branch that includes Sproutcore 1.5. Maurits Lamers has made a fork of martoche's code to fix some build issues related to the 1.5 release of SC. Maurits Lamers fork is available here: https://github.com/mauritslamers/garcon. Clone Garcon in the same manner as above using the git clone command:

    git clone https://github.com/mauritslamers/garcon.git garcon


### Installing node.js

Since Garcon relies on node.js to perform the build-process, node.js needs to be installed. Download node.js (http://nodejs.org/#download) and follow the installation instructions (http://nodejs.org/#build).

The Garcon buildfile
--------------------

The Garcon buildfile starts out with a require command telling node.js where it can find the Garcon "executable". After this, a new server is set up and the application you are building is configured. In this instance the application name is "EurekaJView", it uses the "sc-theme" theme and its buildLanguage is "english".

For this particular build, I am choosing to combine all JavaScript and CSS into single files, but I have chosen not to minify either to allow debugging (this is my development- and test-buildfile). Before the application can be built, I am adding Sproutcore to the build along with any frameworks that my application is relying on. In my case both the SCUI (https://github.com/etgryphon/sproutcore-ui) and flot-sproutcore (https://github.com/imxiaobo/flot-sproutcore.

Finally I am adding a little bit of HTML to the generated HTML file before I fire off the build using myApp.save(); The complete buildfile is included below.


    var g = require('./garcon/lib/garçon'),
        server, myApp;

    // create a server which will listen on port 8000 by default
    server = new g.Server();

    //server = new g.Server({ port: 8010, proxyHost: 'localhost', proxyPort: 8080});


    // adding an application named 'EurekaJView' tells the server to respond to
    // the /EurekaJView url and to create a EurekaJView.html file when saving
    myApp = server.addApp({
        name: 'EurekaJView',
        theme: 'sc-theme', //Specifies the theme to use
        buildLanguage: 'english',
        combineScripts: true, //Combining javascript files to a single file
        combineStylesheets: true, //Combining CSS files to a single file
        minifyScripts: false, //minifies the javascripts (removing unnessesary whitespace, etc.)
        minifyStylesheets: false, //minifies the CSS (removing unnessessarry whitespace, etc.)
        buildVersion: 'eurekaJView' //Uses the name 'eurekaJView' instead of a buildnumber folder
    });

    // myApp needs SproutCore to run
    myApp.addSproutcore();

    // add other dependencies
    myApp.addFrameworks(

        //Adding the standard theme as a framework
        { path:'frameworks/sproutcore/themes/standard_theme', combineScripts: true },

        //Adding third-party and Sproutcore frameworks as dependcies
        { path: 'frameworks/sproutcore/frameworks/statechart', combineScripts: true },
        { path: 'frameworks/flot', combineScripts: true },
        { path: 'frameworks/scui/frameworks/foundation', combineScripts: true },
        { path: 'frameworks/scui/frameworks/sai', combineScripts: true },
        { path: 'frameworks/scui/frameworks/linkit', combineScripts: true },
        { path: 'frameworks/scui/frameworks/drawing', combineScripts: true },
        { path: 'frameworks/scui/frameworks/calendar', combineScripts: true },
        { path: 'frameworks/scui/frameworks/dashboard', combineScripts: true },

        // finally, the sources for myApp must be added as well
        { path: 'apps/' + myApp.name }
    );

    // add some html for inside the <head> tag
    myApp.htmlHead = '<title>EurekaJ View</title>';

    // add some html for inside the <body> tag
    myApp.htmlBody = [
        '<p id="loading">',
        'Loading…',
        '</p>'
    ].join('\n');

    // build the app and, when done, save it to the disk
    myApp.build(function() {
    myApp.save();
    });

Executing the Garcon build with node.js
---------------------------------------

After everything is installed and the Garcon buildfile is set up properly, all that is needed to execute the build is the following command.

    node garcon-buildfile.js

Integrating the built SC Application inside the Java .WAR
---------------------------------------------------------

Once EurekaJView is built conforming to my initial requirements, the process of embedding the EurekaJView into the deployable .WAR file requires three changes to the project. First, EurekaJ.View needs to have its own maven pom.xml file, whose purpose is to execute the following:

Build the EurekaJView using the command 'node garcon-buildfile.js'. I use the maven-exec-plugin to execute this command.
Copy the output of the Garcon build into the Java Applications src/main/webapp directory. I use the maven-exec-plugin to execute this command.
Finally, the pom.xml file of EurekaJ.Manager needs to be have EurekaJ.View as a dependency. This way I am ensuring the maven will build the application in the correct order.

To perform the Garcon build I wrote a shell script that conforms to the requirements above. The script is listed below. I then simply execute this script from the pom using the maven-exec-plugin. The plugin configuration is listed below.

build_dev.sh:

    #!/bin/bash

    rm -r ../EurekaJ.Manager/src/main/webapp/eurekaJView
    rm -r ./build
    /usr/local/bin/node /Users/joahaa/Projects/eurekaj/EurekaJ.View/garcon_build.js
    cp -R ./build/eurekaJView ../EurekaJ.Manager/src/main/webapp/eurekaJView

maven-exec-plugin:

    <build>
        <plugins>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>exec</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <executable>sh</executable>
                    <workingDirectory>${basedir}</workingDirectory>
                    <arguments >
                        <argument>build_dev.sh</argument>
                    </arguments>
                </configuration>
            </plugin>
        </plugins>
    </build>

Source Code
-----------

The complete source code is availble on [Github](a href="https://github.com/joachimhs/EurekaJ).