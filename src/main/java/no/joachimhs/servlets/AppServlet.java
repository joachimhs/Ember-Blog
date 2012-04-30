package no.joachimhs.servlets;

import no.joachimhs.util.ParseFileUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.net.URL;

/**
 * Created by IntelliJ IDEA.
 * User: joahaa
 * Date: 3/31/12
 * Time: 12:36 PM
 * To change this template use File | Settings | File Templates.
 */
public class AppServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
        String htmlContent = null;

        String reqUrl = req.getRequestURI().toString();
        String urlParts[] = reqUrl.split("/");
        String appName = null;
        if (urlParts.length == 3) {
            appName = urlParts[2];
        }

        System.out.println("Getting App file: " + appName);
        URL resource = getServletContext().getResource("/app/" + appName);
        File file = new File(resource.getPath());
        htmlContent = ParseFileUtil.getFileContents(file);

        response.setContentType("text/JavaScript");
        response.getWriter().write(htmlContent);
    }
}
