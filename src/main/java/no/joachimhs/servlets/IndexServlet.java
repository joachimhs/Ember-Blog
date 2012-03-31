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
public class IndexServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Getting index.html");
        String htmlContent = null;

        String reqUrl = req.getRequestURI().toString();
        String urlParts[] = reqUrl.split("/");
        String selectedPhotoID = "0";
        if (urlParts.length == 3) {
            selectedPhotoID = urlParts[2];
        }

        URL resource = getServletContext().getResource("/index.html");
        File file = new File(resource.getPath());
        htmlContent = ParseFileUtil.getFileContents(file);

        if (htmlContent != null) {
            htmlContent = htmlContent.replaceAll("selectedPhotoElement = photos\\[0\\]", "selectedPhotoElement = photos[" + selectedPhotoID + "]");
        }

        response.getWriter().write(htmlContent);
    }
}
